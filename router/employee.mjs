import express from 'express'
import { createNewEmployee,getAllEmployee,loginEmployee,employeeForgotPassword,getEmployeeReset,savenewPassword,employeeRemove,employeeUpdate,UpdateSelfEmployee,UpdateSelfPassword, validateEmail, updateProfile, NotificationRead, storageFile1 } from '../controllers/employeecontroller.mjs'
import multer from 'multer';
const router = express.Router();
const upload1 = multer({storage:storageFile1});


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
router.post('/updateprofile/:id',upload1.single('file'),updateProfile);
router.patch('/notificationUpdate/:id',NotificationRead)
export default router; 