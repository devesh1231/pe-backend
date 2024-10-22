const User = require('../models/user.model'); // Assuming you named your model `User.js`
const bcrypt = require('bcrypt');
const MealTable = require('../models/meal.model');
const MealPreference = require('../models/mealPreference.model')
const Order = require('../models/order.model');
const MealPriceTable = require('../models/mealPrice.model');
const jwt = require('jsonwebtoken');
const { getCurrentDateTime, sendEmailService } = require('../utils/index')
require("dotenv/config");
const crypto = require('crypto');
const Razorpay = require('razorpay');

async function calculateMealPrice(user) {
    const { meal, scheduleMeal, dailyMacros, goal } = user;
    const { kcal } = dailyMacros;

    // Sort the meal array to ensure the order doesn't affect the query
    const sortedMeals = meal.sort();

    // Construct the query to match the same set of meals, regardless of order
    const mealPriceQuery = {
        days: scheduleMeal,
        meal: { $all: sortedMeals, $size: sortedMeals.length } // Ensure that the length matches as well
    };

    console.log(mealPriceQuery);

    // Fetch the matching price data
    const priceData = await MealPriceTable.findOne(mealPriceQuery).select('actualPrice displayPrice meal');
    console.log(priceData);

    if (!priceData) {
        console.log("bhag sare kuch na mila");
        return null;
    }

    const basePrice = priceData?.displayPrice;
    let additionalPrice = 0;

    // Gain Scenario
    if (goal === 'gain' && kcal > 3000) {
        const excessKcal = kcal - 3000; // Calories above 3000
        const blocks = Math.floor(excessKcal / 250); // Number of complete 250 kcal blocks
        console.log("blocks are", blocks, meal.length, scheduleMeal)
        additionalPrice = (blocks + 1) * 21.2 * meal.length * scheduleMeal; // (blocks + 1) to account for the first block
    }

    // Loss Scenario
    else if (goal === 'loss' && kcal >= 2000 && kcal <= 3000) {
        const excessKcal = kcal - 2000; // Calories above 2000
        const blocks = Math.floor(excessKcal / 250); // Number of complete 250 kcal blocks

        additionalPrice = (blocks + 1) * 17 * meal.length * scheduleMeal; // Using 17 for loss scenario
    }

    const totalPrice = basePrice + additionalPrice;
    console.log(additionalPrice)
    return {
        totalPrice,
    };
}








const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});





// Payment verification function
const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    return generated_signature === razorpay_signature;
};

const registerController = async (request, response) => {
    const { name,
        phone,
        email,
        weightlossinkg,
        fcm,
        password,
        age,
        gender,
        workOutSchedule,
        height,
        weight,
        scheduleMeal,
        goal,
        dailyMacros,
        breakfastMacros,
        lunchMacros,
        dinnerMacros,
        address,
        snackMacros,
        diet,
        meal,
        duration
    } = request.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({
                status_code: 400,
                message: "User already exists"
            });
        }
        //   const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password;
        const user = new User({
            name,
            phone,
            email,
            weightlossinkg,
            fcm,
            scheduleMeal,
            password: hashedPassword,
            age,
            diet,
            dailyMacros,
            workOutSchedule,
            breakfastMacros,
            lunchMacros,
            dinnerMacros,
            snackMacros,
            isFirstTime: true,
            gender,
            height,
            weight,
            goal,
            address,
            meal,
            duration,
        });
        const savedUser = await user.save();

        response.status(200).json({
            status_code: 200,
            data: savedUser,
            message: 'User registered successfully',

        });
    } catch (err) {
        response.status(500).json({
            status_code: 500,
            message: 'Server is not working', error: err.message
        });
    }
};



const loginController = async (req, res) => {
    const { email, password, appleId } = req.body;
    const { loginMode } = req.query;
    console.log("hii");
    console.log(req.body)

    try {
        let user;

        // Google Authentication
        if (loginMode === "google-auth") {
            user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    email,
                });
            }

            // Token without expiry
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // No expiresIn property
            user.token = token;
            user.loginTime = getCurrentDateTime();
            const userData = await user.save();

            return res.status(200).json({
                status_code: 200,
                message: user.isNew ? 'User created and logged in successfully' : 'User logged in successfully',
                data: userData,
            });

            // Manual Authentication
        } else if (loginMode === "manual") {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status_code: 400,
                    message: 'User not found',
                });
            }

            const isMatch = password == user.password;
            if (!isMatch) {
                return res.status(400).json({
                    status_code: 400,
                    message: 'Invalid credentials',
                });
            }

            // Token without expiry
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // No expiresIn property
            user.token = token;
            user.loginTime = getCurrentDateTime();

            const userData = await user.save();

            return res.status(200).json({
                status_code: 200,
                message: 'Login successful',
                data: userData,
            });

            // Apple ID Authentication
        } else if (loginMode == "apple-auth") {
            user = await User.findOne({ appleId });  // Finding user by appleId
            if (!user) {
                user = new User({
                    appleId, // Storing appleId for this user
                    email,
                });
            }

            // Token without expiry
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // No expiresIn property
            user.token = token;
            user.loginTime = getCurrentDateTime();
            const userData = await user.save();

            return res.status(200).json({
                status_code: 200,
                message: user.isNew ? 'User created and logged in successfully' : 'User logged in successfully',
                data: userData,
            });


        } else {
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid login mode',
            });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({
            status_code: 500,
            message: 'Server error',
            error: err.message,
        });
    }
};





// View Profile Controller
const viewProfileController = async (request, response) => {
    try {
        // Assuming the user ID is stored in the JWT token
        console.log(request.user)
        const user = await User.findById(request.user._id).select('-password');
        if (!user) {
            return response.status(404).json({
                status_code: 400,
                message: 'User not found'
            });
        }
        response.status(200).json({
            status_code: 200,
            data: user,
            message: "User profile fetched successfully"
        });
    } catch (err) {
        response.status(500).json({
            status_code: 400,
            message: 'Server error', error: err.message
        });
    }
};

// Update Profile Controller
const updateProfileController = async (req, res) => {
    try {
        const {
            password,
            ...fieldsToUpdate
        } = req.body;

        let updatedFields = {};
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }
        const allowedFields = [
            'name',
            'phone',
            'email',
            'weightlossinkg',
            'address',
            'workOutSchedule',
            'age',
            'gender',
            'height',
            'weight',
            'scheduleMeal',
            'goal',
            'meal',
            'duration',
            'fcm',
            'isFirstTime',
            'diet',
            'dailyMacros',
            'breakfastMacros',
            'lunchMacros',
            'dinnerMacros',
            'snackMacros',
        ];
        allowedFields.forEach(field => {
            if (fieldsToUpdate[field] !== undefined) {
                updatedFields[field] = fieldsToUpdate[field];
            }
        });
        updatedFields.updatedAt = getCurrentDateTime();

        const user = await User.findByIdAndUpdate(req.user._id, updatedFields, { new: true });
        if (!user) {
            return res.status(404).json({
                status_code: 404,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            status_code: 200,
            message: 'Profile updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            status_code: 500,
            message: 'Server error',
            error: error.message
        });
    }
};


const getAllUsersController = async (request, response) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the responseponse
        response.status(200).json({
            status_code: 400,
            data: users
        });
    } catch (err) {
        response.status(500).json({
            status_code: 500,
            message: 'Server error',
            error: err.message
        });
    }
};




const deleteUserController = async (req, response) => {
    const { id } = req.query;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return response.status(404).json({ status_code: 400, message: 'User not found' });
        }

        response.status(200).json({
            status_code: 200,
            message: 'User deleted successfully'
        });
    } catch (err) {
        response.status(500).json({
            status_code: 500,
            message: 'Server error', error: err.message
        });
    }
};


const getMealController = async (req, res) => {
    try {
        const user = req.user;
        const diet = user.diet;
        const goal = user.goal;
        const mealDuration = user.scheduleMeal || 7;
        const today = getCurrentDateTime();
        const todayDate = new Date(today);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mealDays = [];
        const userPreferredMeals = user.meal.map(meal => meal.toLowerCase());

        const skipDates = ['2024-10-30', '2024-10-31', '2024-11-01'];

        // Find the latest order
        const latestOrder = await Order.findOne({ userId: user._id }).sort({ createdAt: -1 });
        console.log(latestOrder);

        let startDate = todayDate; // Default to today if no meals found
        if (latestOrder && latestOrder.meals) {
            const mealDates = Object.keys(latestOrder.meals);
            if (mealDates.length > 0) {
                startDate = new Date(mealDates[mealDates.length - 1]);
            }
        }

        console.log(startDate);
        // Generate mealDays excluding the hardcoded dates
        for (let i = 1; i <= mealDuration; i++) {
            const mealDay = new Date(startDate);
            mealDay.setDate(startDate.getDate() + i);
            const formattedMealDay = mealDay.toISOString().split('T')[0];

            // Skip hardcoded dates
            if (!skipDates.includes(formattedMealDay)) {
                mealDays.push(formattedMealDay);
            }
        }

        console.log(`Fetching meals for the next ${mealDuration} days (excluding skip dates): ${mealDays}`);

        // Get meal preferences for the specified dates
        const preferences = await MealPreference.find({ user: user._id, date: { $in: mealDays } }).populate({
            path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
            model: 'MealTables'
        });
        const responseMeals = {};
        const filterMealsByDiet = (meals) => {
            return meals.filter(meal => {
                if (diet === 'veg') return meal.CuisineType === 'veg';
                if (diet === 'non-veg') return meal.CuisineType === 'non-veg';
                if (diet === 'ovo') return meal.CuisineType === 'ovo' || meal.CuisineType === 'veg';
                return true;
            });
        };

        const filterMealsByPreference = (mealsObject) => {
            const filteredMeals = {};

            if (userPreferredMeals.includes('any meal')) return mealsObject;

            if (userPreferredMeals.includes('breakfast')) filteredMeals.breakfast = mealsObject.breakfast;
            if (userPreferredMeals.includes('lunch')) filteredMeals.lunch = mealsObject.lunch;
            if (userPreferredMeals.includes('dinner')) filteredMeals.dinner = mealsObject.dinner;
            if (userPreferredMeals.includes('snacks')) filteredMeals.snacks = mealsObject.snacks;

            return filteredMeals;
        };

        for (const day of mealDays) {
            const preference = preferences.find(pref => pref.date === day);
            const date = new Date(day);
            const dayOfWeek = daysOfWeek[date.getDay()];

            let mealsForTheDay = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: []
            };

            if (preference) {
                mealsForTheDay = {
                    breakfast: preference.meals.breakfast.length > 0 ? filterMealsByDiet(preference.meals.breakfast) : [],
                    lunch: preference.meals.lunch.length > 0 ? filterMealsByDiet(preference.meals.lunch) : [],
                    dinner: preference.meals.dinner.length > 0 ? filterMealsByDiet(preference.meals.dinner) : [],
                    snacks: preference.meals.snacks.length > 0 ? filterMealsByDiet(preference.meals.snacks) : []
                };
            }

            // Fetch default meals for any empty meal types
            if (mealsForTheDay.breakfast.length === 0 || mealsForTheDay.lunch.length === 0 || mealsForTheDay.dinner.length === 0 || mealsForTheDay.snacks.length === 0) {
                const defaultMeals = await MealTable.find({ mealDay: dayOfWeek, goal: goal });

                mealsForTheDay = {
                    breakfast: mealsForTheDay.breakfast.length > 0
                        ? mealsForTheDay.breakfast
                        : filterMealsByDiet(defaultMeals.filter(meal => meal.mealType === 'breakfast')),
                    lunch: mealsForTheDay.lunch.length > 0
                        ? mealsForTheDay.lunch
                        : filterMealsByDiet(defaultMeals.filter(meal => meal.mealType === 'lunch')),
                    dinner: mealsForTheDay.dinner.length > 0
                        ? mealsForTheDay.dinner
                        : filterMealsByDiet(defaultMeals.filter(meal => meal.mealType === 'dinner')),
                    snacks: mealsForTheDay.snacks.length > 0
                        ? mealsForTheDay.snacks
                        : filterMealsByDiet(defaultMeals.filter(meal => meal.mealType === 'snacks'))
                };
            }

            responseMeals[day] = filterMealsByPreference(mealsForTheDay);
        }

        const mealPrice = await calculateMealPrice(user);
        user.appversion = "1.0.0.5";
        console.log(mealPrice);
        console.log("Hii devesh");
        return res.json({
            data: {
                responseMeals,
                user,
                mealPrice
            },
            message: `Meals for the next ${mealDuration} days (excluding specific skipped dates) fetched successfully`
        });
    } catch (error) {
        console.error(error);
        return res.json({
            status_code: 500,
            message: "Something went wrong"
        });
    }
};





const replaceMeal = async (req, res) => {
    try {
        const { mealId, date, mealType } = req.body;


        if (!mealId || !mealType || !date) {
            return res.status(400).json({
                status_code: 400,
                message: 'Meal ID, meal type, and date are required'
            });
        }

        const meal = await MealTable.findById(mealId);
        if (!meal) {
            return res.status(404).json({
                status_code: 404,
                message: 'Meal not found'
            });
        }


        const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
        if (!validMealTypes.includes(mealType)) {
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid meal type. Must be one of breakfast, lunch, dinner, or snacks'
            });
        }

        const userId = req.user._id;


        let mealPreference = await MealPreference.findOne({ user: userId, date: date });


        if (!mealPreference) {
            mealPreference = new MealPreference({
                user: userId,
                date: date,
                meals: {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: []
                }
            });
        }


        mealPreference.meals[mealType] = [mealId];


        await mealPreference.save();
        res.status(200).json({
            status_code: 200,
            message: 'Meal successfully replaced in meal preference',
            data: mealPreference
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status_code: 500,
            message: 'Server error while replacing meal in meal preference',
            error: error.message
        });
    }
};



const generateOrderId = async (req, res) => {
    try {
        const { amount } = req.body;  // Amount is passed from the frontend

        // Creating Razorpay order options

        console.log(amount)
        const options = {
            amount: amount * 100, // Amount in paise (multiply by 100)
            currency: 'INR',
            receipt: `receipt_${Math.random() * 1000}`, // Unique receipt id
        };

        console.log(options)
        const razorpayOrder = await razorpayInstance.orders.create(options);
        console.log(razorpayOrder)
        if (!razorpayOrder) {
            return res.status(500).json({
                status: false,
                message: "Failed to create Razorpay order"
            });
        }

        console.log("hii")
        return res.status(200).json({
            status: true,
            data: {
                razorpay_order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            message: "Razorpay order created successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
};


// const checkOut = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, meals, price, deliveryTime, discount } = req.body;
//         const user = req.user; // Assuming user is authenticated

//         // Verify Razorpay payment
//         const isValidPayment = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

//         if (!isValidPayment) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Payment verification failed",
//             });
//         }

//         // Payment is verified, now create and save the order
//         const newOrder = new Order({
//             meals,
//             userId: user._id,
//             discount,
//             deliveryTime,
//             address: "Block B",  // Modify as needed
//             price,
//             totalDays: user.scheduleMeal,  // Assuming scheduleMeal exists on user
//             razorpay_order_id,
//             razorpay_payment_id,
//             payment_status: 'paid',
//         });

//         const savedOrder = await newOrder.save();

//         return res.status(200).json({
//             status: true,
//             data: savedOrder,
//             message: "Order placed successfully",
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: false,
//             message: "Something went wrong",
//         });
//     }
// };


const checkOut = async (req, res) => {
    try {
        const user = req.user;
        const { meals, price, deliveryTime, discount } = req.body;
        console.log(meals);
        if (meals.size == 0) {
            ssssssssssss
            return res.json({
                data: "",
                message: "please add atleast 1  meal for checkout"
            })
        }
        const newOrder = new Order({
            meals,
            userId: user._id,
            discount,
            deliveryTime,
            address: "Block B",
            price,
            totalDays: user.scheduleMeal,
        })
        const savedOrder = await newOrder.save();
        return res.json({
            status: 200,
            data: savedOrder,
            message: "your order placed succefully"
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            data: "",
            message: "something went wrong"
        })
    }
}


const viewOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);

        // Find orders by userId and sort by 'createdAt' in descending order (-1 for latest first)
        const order = await Order.find({ userId }).sort({ createdAt: -1 });

        console.log(order);
        return res.json({
            status: true,
            data: order,
            message: "Your order fetched successfully"
        });
    } catch (error) {
        console.error(error); // log error for debugging
        return res.json({
            status: false,
            data: "",
            message: "Server error"
        });
    }
}




const updateOrder = async (req, res) => {
    try {
        const { id } = req.query;
        const { date, mealId } = req.body;


        const order = await Order.findById(id);
        const meal = await MealTable.findById(mealId);


        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }
        if (!meal) {
            return res.status(404).json({ status: false, message: "Meal not found" });
        }


        const mealType = meal.mealType;


        if (!order.meals[date]) {
            return res.status(404).json({
                status: false,
                message: `No meals found for the date ${date}`
            });
        }


        order.meals[date][mealType] = meal;


        order.markModified(`meals.${date}.${mealType}`);


        const savedOrder = await order.save();


        return res.json({
            status: true,
            data: savedOrder,
            message: "Meal updated successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};




const coachAppoinntment = async (req, res) => {
    try {
        const user = req.user;
        const { date, time } = req.body;
        console.log(time)
        const sendMail = await sendEmailService(user.email, user?.name, " I would like to schedule an appointment to discuss training progress", date, time);
        return res.json({
            data: sendMail,
            message: "send mail"
        })

    }
    catch (error) {
        return res.json({
            message: "something went wrong"
        })
    }
}
module.exports = { registerController, getAllUsersController, deleteUserController, viewProfileController, loginController, updateProfileController, getMealController, replaceMeal, checkOut, viewOrder, updateOrder, generateOrderId, coachAppoinntment }