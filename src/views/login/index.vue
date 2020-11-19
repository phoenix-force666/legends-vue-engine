<template>
  <div class="login-container">
    <div id="rrapp">
      <canvas id="canvas" class="canvas"></canvas>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h3 class="title">工单审批</h3>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="password"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            Sign in
          </el-button>
        </el-form-item>
        <SocialSign />
        <!--<div class="tips">
        <span>成为真正的太阳，</span>
        <span>照进你的心里</span>
      </div>-->
        <!-- <el-button class="thirdparty-button" type="primary" @click="showthirdpartyDialog=true">
        第三方
      </el-button>-->
      </el-form>
    </div>
    <div id="bg_anime">
      <div class="bg-sky"></div>
      <div class="bg-far">
        <div class="cloud"></div>
        <div class="rainbow"></div>
        <div class="island"></div>
      </div>
      <div class="bg-boat">
        <div class="wave-1"></div>
        <div class="boat"></div>
        <div class="wave-2"></div>
      </div>
    </div>
    <!--    <el-dialog :visible.sync="showthirdpartyDialog" :modal-append-to-body="false" title="第三方登录">
      <social-sign/>
    </el-dialog>-->
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSign";
export default {
  name: "Login",
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "admin"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      showthirdpartyDialog: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created: function() {
    if (this.$route.query.error) {
      this.$message({
        message: "登录失败" + this.$route.query.error,
        type: "warning"
      });
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    var canvas = document.querySelector(" canvas "),
      ctx = canvas.getContext(" 2d ");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = new Color(150).style;

    var mousePosition = {
      x: canvas.width - 100,
      y: canvas.height - 60
    };

    var dots = {
      nb: 250,
      distance: 100,
      d_radius: 150,
      array: []
    };

    function colorValue(min) {
      return Math.floor(Math.random() * 255 + min);
    }

    function createColorStyle(r, g, b) {
      return "rgba(" + r + "," + g + "," + b + ", 0.8)";
    }

    function mixComponents(comp1, weight1, comp2, weight2) {
      return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    function averageColorStyles(dot1, dot2) {
      var color1 = dot1.color,
        color2 = dot2.color;

      var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
        g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
        b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
      return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }

    function Color(min) {
      min = min || 0;
      this.r = colorValue(min);
      this.g = colorValue(min);
      this.b = colorValue(min);
      this.style = createColorStyle(this.r, this.g, this.b);
    }

    function Dot() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      this.vx = -0.5 + Math.random();
      this.vy = -0.5 + Math.random();

      this.radius = Math.random() * 2;

      this.color = new Color();
    }

    Dot.prototype = {
      draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.color.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }
    };

    function createDots() {
      for (var i = 0; i < dots.nb; i++) {
        dots.array.push(new Dot());
      }
    }

    function moveDots() {
      for (var i = 0; i < dots.nb; i++) {
        var dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }

    function connectDots() {
      for (var i = 0; i < dots.nb; i++) {
        for (var j = 0; j < dots.nb; j++) {
          var i_dot = dots.array[i];
          var j_dot = dots.array[j];

          if (
            i_dot.x - j_dot.x < dots.distance &&
            i_dot.y - j_dot.y < dots.distance &&
            i_dot.x - j_dot.x > -dots.distance &&
            i_dot.y - j_dot.y > -dots.distance
          ) {
            if (
              i_dot.x - mousePosition.x < dots.d_radius &&
              i_dot.y - mousePosition.y < dots.d_radius &&
              i_dot.x - mousePosition.x > -dots.d_radius &&
              i_dot.y - mousePosition.y > -dots.d_radius
            ) {
              ctx.beginPath();
              ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    }

    function drawDots() {
      for (var i = 0; i < dots.nb; i++) {
        var dot = dots.array[i];
        dot.draw();
      }
    }

    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveDots();
      connectDots();
      drawDots();

      requestAnimationFrame(animateDots);
    }

    //----------------------跟着鼠标动--------------------
    document.getElementById("rrapp").addEventListener("mousemove", function(e) {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    });

    document
      .getElementById("rrapp")
      .addEventListener("mouseleave", function(e) {
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;
      });
    //----------------------跟着鼠标动--------------------

    createDots();
    requestAnimationFrame(animateDots);
  },

  mounted() {
    var canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = new Color(150).style;

    var mousePosition = {
      x: canvas.width - 100,
      y: canvas.height - 60
    };

    var dots = {
      nb: 250,
      distance: 100,
      d_radius: 150,
      array: []
    };

    function colorValue(min) {
      return Math.floor(Math.random() * 255 + min);
    }

    function createColorStyle(r, g, b) {
      return "rgba(" + r + "," + g + "," + b + ", 0.8)";
    }

    function mixComponents(comp1, weight1, comp2, weight2) {
      return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    function averageColorStyles(dot1, dot2) {
      var color1 = dot1.color,
        color2 = dot2.color;

      var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
        g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
        b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
      return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }

    function Color(min) {
      min = min || 0;
      this.r = colorValue(min);
      this.g = colorValue(min);
      this.b = colorValue(min);
      this.style = createColorStyle(this.r, this.g, this.b);
    }

    function Dot() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      this.vx = -0.5 + Math.random();
      this.vy = -0.5 + Math.random();

      this.radius = Math.random() * 2;

      this.color = new Color();
    }

    Dot.prototype = {
      draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.color.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }
    };

    function createDots() {
      for (var i = 0; i < dots.nb; i++) {
        dots.array.push(new Dot());
      }
    }

    function moveDots() {
      for (var i = 0; i < dots.nb; i++) {
        var dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }

    function connectDots() {
      for (var i = 0; i < dots.nb; i++) {
        for (var j = 0; j < dots.nb; j++) {
          var i_dot = dots.array[i];
          var j_dot = dots.array[j];

          if (
            i_dot.x - j_dot.x < dots.distance &&
            i_dot.y - j_dot.y < dots.distance &&
            i_dot.x - j_dot.x > -dots.distance &&
            i_dot.y - j_dot.y > -dots.distance
          ) {
            if (
              i_dot.x - mousePosition.x < dots.d_radius &&
              i_dot.y - mousePosition.y < dots.d_radius &&
              i_dot.x - mousePosition.x > -dots.d_radius &&
              i_dot.y - mousePosition.y > -dots.d_radius
            ) {
              ctx.beginPath();
              ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    }

    function drawDots() {
      for (var i = 0; i < dots.nb; i++) {
        var dot = dots.array[i];
        dot.draw();
      }
    }

    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveDots();
      connectDots();
      drawDots();

      requestAnimationFrame(animateDots);
    }

    //----------------------跟着鼠标动--------------------
    document.getElementById("rrapp").addEventListener("mousemove", function(e) {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    });

    document
      .getElementById("rrapp")
      .addEventListener("mouseleave", function(e) {
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;
      });
    //----------------------跟着鼠标动--------------------

    createDots();
    requestAnimationFrame(animateDots);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

@import "./style/mixin.scss";
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}
.user-item {
  padding-left: 10px;
  display: flex;
  align-items: center;
}
.login-container {
  @include relative;
  height: 100vh;
  background-color: #222;
  overflow-y: hidden;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
    -webkit-text-fill-color: #555 !important;
    /*background-color: rgb(250, 255, 189);*/
  }
  #rrapp {
    position: relative;
    height: 100%;
    z-index: 10;
    width: 30%;
    float: right;
  }
  .canvas {
    position: fixed;
    background-color: rgba(233, 233, 233, 0);
    border-radius: 30% 10% 10% 30%;
    left: 0;
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }
  .el-input {
    display: inline-block;
    /*height:34px;*/
    /*line-height: 34px;*/
    height: 45px;
    line-height: 45px;
    width: 85%;
    border-radius: 0;
    box-shadow: none;
    /*border-color: #d2d6de;*/
    /*border: 1px solid #ccc;*/
    input {
      /*color: #555 !important;*/
      /*height: 34px !important;*/
      height: 45px !important;
    }
  }
  .title {
    font-size: 35px;
    font-weight: 700;
    color: #3c8dbc;
    margin: 0 auto 40px;
    text-align: center;
    font-weight: bold;
  }

  .login-form {
    /*background-color: #fff;*/
    position: absolute;
    /* left: 0; */
    right: 20px;
    width: 400px;
    padding: 35px 20px 15px;
    margin: 120px auto;
    /*transform: translateY(50%);*/
    .login-logo {
      font-size: 35px;
      text-align: center;
      margin: 25px 0;
      font-weight: 300;
      .titleColor {
        color: #3c8dbc;
        text-shadow: #ddd 1px 2px;
        font-weight: 700;
      }
    }
    .form-box {
      border-radius: 4px !important;
      padding: 20px 20px 0 20px;
      background: #fff;
      padding: 20px;
      border-top: 0;
      color: #666;
      .form-item {
        background-color: #fff !important;
        border-radius: 0;
        /*padding: 0 5px 0 15px;*/
        color: #eeeeee;
        height: 47px;
        border-color: #d2d6de;
        border: 1px solid #ccc;
        line-height: 47px;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .forget-pwd {
    color: #fff;
  }
  #bg_anime {
    position: relative;
    z-index: 5;
    min-height: 794px;
    height: 100%;
    width: 100%;
    -webkit-animation: "skycolor" 20s linear infinite;
    animation: "skycolor" 20s linear infinite;
  }
  .bg-boat {
    height: 400px;
    z-index: 5;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .wave-1 {
    background: url(./img/wave_back.png) 0 0 rgba(0, 0, 0, 0);
    width: 100%;
    height: 133px;
    position: absolute;
    top: 160px;
    -webkit-animation: "flymove" 18s linear infinite;
    animation: "flymove" 12s linear infinite;
  }
  .wave-2 {
    background: url(./img/wave_front.png) 0 0 rgba(0, 0, 0, 0);
    width: 100%;
    height: 195px;
    position: absolute;
    bottom: 0;
    -webkit-animation: "flymove" 16s linear infinite;
    animation: "flymove" 16s linear infinite;
  }
  .boat {
    background: url(./img/boat.png) 0 0 rgba(0, 0, 0, 0);
    width: 333px;
    height: 218px;
    position: absolute;
    left: 35%;
    top: 10px;
  }
  .bg-far {
    height: 400px;
    z-index: 3;
    position: absolute;
    width: 100%;
    bottom: 200px;
  }
  .cloud {
    background: url(./img/cloud.png) 0 0 no-repeat rgba(0, 0, 0, 0);
    width: 100%;
    height: 230px;
    position: absolute;
    -webkit-animation: "flymove" 12s linear infinite;
    animation: "flymove" 12s linear infinite;
    z-index: 1;
  }
  .rainbow {
    background: url(./img/rainbow.png) 0 0 no-repeat rgba(0, 0, 0, 0);
    background-size: contain;
    width: 100%;
    height: 400px;
    position: absolute;
    -webkit-animation: "flymove" 22s linear infinite;
    animation: "flymove" 22s linear infinite;
  }
  .island {
    background: url(./img/island.png) 0 0 no-repeat rgba(0, 0, 0, 0);
    width: 100%;
    height: 180px;
    position: absolute;
    -webkit-animation: "flymove" 17s linear infinite;
    animation: "flymove" 17s linear infinite;
    bottom: 20px;
  }
  @-webkit-keyframes flymove {
    0% {
      background-position: -200% 0;
    }
    50% {
      background-position: 0 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  @-webkit-keyframes skycolor {
    0% {
      background-color: rgba(171, 218, 232, 1);
    }
    33% {
      background-color: rgba(232, 113, 58, 1);
    }
    67% {
      background-color: rgba(4, 16, 143, 1);
    }
    100% {
      background-color: rgba(171, 218, 232, 1);
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out,
          background-color 99999s ease-out;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url("img/bg.jpg");
  background-size: cover;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
