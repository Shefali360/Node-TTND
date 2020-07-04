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
    try {
      const response = await deptService.getDept(
        req.query
      );
      res.send(response);
    } catch (err) {
      next(err);
    }
  };

  module.exports.editDept= async (req, res, next) => {
    try {
      const department= await deptService.editDept(req.params, req.body);
      res.send(department);
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