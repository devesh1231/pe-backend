


export const customerDefaultController = async (req, res) => {
    try {
      console.log("customer Route Working Fine")
      return res.status(200).json({
        status_code:200,
        data:"",
        message:"I am working fine!"
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status_code: 400,
        data: [],
        message: "Something went wrong",
      });
    }
  };