import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hardwhere/view/screen/auth/signup.dart';

abstract class LoginController extends GetxController{
  login();
  toSignUp();

}

class LoginControllerImp extends LoginController{
  GlobalKey<FormState> formState=GlobalKey<FormState>();
  bool isShowPass=true;
  IconData icon=Icons.visibility;
  void togglePassObscure(){
    isShowPass=!isShowPass;
    icon=isShowPass?Icons.visibility:Icons.visibility_off;
    update();
  }
  @override
  login() {
    if(formState.currentState!.validate())
      {

      }
    else{

    }
  }

  @override
  toSignUp() {
    Get.delete<LoginControllerImp>();
    Get.to(const SignUp());
  }
}