<template>
  <v-app :height="height">
    <v-content>
      <BasicNavBarLanding/>
    </v-content>

    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="6" lg="6" xl="4" align="center" width="700">
          <v-card id="cardArea" outlined dark fill-height>
            <v-card-title class="justify-center">
              <h3 id="h3_">Login to E-Trip</h3>
            </v-card-title>
            <v-card-subtitle id="subtitle_">Don't have an account?
             <v-btn @click="toSignUp" >Sign up</v-btn></v-card-subtitle>


            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                type="email"
                label="E-mail"
                autocomplete="username"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="Password"
                :type="show ?'text': 'password'"
                :append-icon="show ?'mdi-eye':'mdi-eye-off'"
                @click:append="show=!show"
                outlined
                autocomplete="current-password"
                required
              >
              </v-text-field>

              <v-btn class="mr-4" @click="forgetPassword">Forgot your Password?</v-btn>

              <br>
              <v-btn id="loginButton" block x-large :disabled="!valid" class="mr-4" @click="login" rounded>Login</v-btn>


            </v-form>

            <v-snackbar v-model="snackbar" color="error">
              {{ errorMessage }}
            </v-snackbar>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import BasicNavBarLanding from "~/components/BasicNavBarLanding";

export default {
  components: {
    BasicNavBarLanding,
  },
  layout: "plain",
  /**
   * uses vue's data competent to work with data in html  https://vuejs.org/guide/essentials/component-basics.html#defining-a-component
   * and with this we use regexes to check if the user input is valid
   * @returns {{valid: boolean, password: string, name: string, nameRules: (function(*))[], passwordRules: (function(*))[], errorMessage: string, show: boolean, emailRules: (function(*))[], snackbar: boolean, email: string}}
   */
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must minimums 6 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    //snackbar per default false because no firebase error here before submitting
    snackbar: false,
    errorMessage: "",

    show: false,
  }),
  methods: {
    /**
     * login function requires the firebase setup in nuxt config js
     * local checks for data correctness via regexes
     */
    login() {
      let formValidation = this.$refs.form.validate();
      if (formValidation) {
        // access firebase instance threw nuxt $
        this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            const authUser = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            };
            // make a new mutation ion our store explanation there
            // if something fails show error in snackbar
            this.$store
              .dispatch("onAuthStateChangedAction", {
                authUser,
              })
              .then(() => {
                this.$router.replace("/routepage");
              })
              .catch((error) => {});
          })
          .catch((error) => {
            this.snackbar = true;
            this.errorMessage = error.message;
          });
      }
    },
    forgetPassword() {
      this.$router.push("/auth/resetpassword");
    },
    toSignUp() {
      this.$router.push('/auth/signUp');
    },


    //responsive - breakpoints
    height () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },

    //responsive
    onResize () {
      this.isMobile = window.innerWidth < 600
    },

  },


  //responsive
  beforeDestroy () {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted () {
    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
  },

};


</script>

<style>
html {
  background: #121212;
}
#cardArea {
  padding: 3rem 2rem 3rem ;
  border-radius: 20px;
}

form {
  padding: 2rem 0;

}

#subtitle_ {
  font-size: medium;
  color: #fff;
}


#loginButton {
  background: #398A0B;
  color: #fff;
  width: 10rem;
  margin-top: 3rem;
  margin-left: 0.1%;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}


</style>
