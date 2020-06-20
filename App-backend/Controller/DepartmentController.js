const deptService=require('../Services/DepartmentServices');

module.exports.createDept= async(req, res,next) => {
    try{
      const response=await deptService.createDept(req.body);
      res.send(response);
    }
    catch (err) {
     next(err);
    }
  };

  module.exports.getDept = async (req, res, next) => {
    const limitCount = req.query.limit;
    delete req.query.limit;
    const skipCount = req.query.skip;
    delete req.query.skip;
    try {
      const response = await deptService.getDept(
        req.query,
        Number(limitCount),Number(skipCount)
      );
      res.send(response);
    } catch (err) {
      next(err);
    }
  };

  module.exports.delete = async (req, res) => {
    try {
      const response = await deptService.delete(req.params);
      res.send(response);
    } catch (err) {
      res.status(500).send(err);
    }
  };