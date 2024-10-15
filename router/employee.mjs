import express from 'express'
import { createNewEmployee,getAllEmployee,loginEmployee,employeeForgotPassword,getEmployeeReset,savenewPassword,employeeRemove,employeeUpdate,UpdateSelfEmployee,UpdateSelfPassword, validateEmail, updateProfile } from '../controllers/employeecontroller.mjs'
const router = express.Router();

router.post('/newEmployee',createNewEmployee);
router.get('/employeesCollection',getAllEmployee);
router.post('/employeesignup/',loginEmployee);
router.post('/forgotpasswor',employeeForgotPassword);
router.get('/reset-password/:id/:token',getEmployeeReset);
router.post('/reset-password/:id/:token',savenewPassword);
router.delete('/deleteemployeeinformation/:id',employeeRemove);
router.patch('/:id/updateemployee',employeeUpdate)
router.patch('/:id/updateselfinformation',UpdateSelfEmployee)
router.patch('/:id/selfpasswordupdate',UpdateSelfPassword);
router.get('/employeevalidate/:email',validateEmail);
router.patch('/updateprofile/:id',updateProfile)
export default router; 