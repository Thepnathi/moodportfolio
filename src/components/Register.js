import React from 'react'
import ReactDOM from 'react-dom'
import {withFormik, Form, Field} from 'formik'
import * as Yup from 'yup'
import App from '../App'
import Login from './Login'
import '../stylesheet/register.css'
import logo from '../images/logo.png'

const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

function redirectToLogin() {
  ReactDOM.render(
    <Login />,
    document.getElementById('root')
  ); 
}

const RegisterApp = ({
  values,
  errors,
  touched
}) => (
  <div>
    <Form className="formBody">
      <img id="registerLogo" src={logo} alt="Moodportfol.io Logo"/>
      <div>
        <Field className="field"
          name="name"
          placeholder="Your Name"/>
          {touched.name && errors.name && <p>{errors.name}</p>}
      </div>

      {/* touched.* makes sure that errors are checked only once the fiels is left */}
      <div>
        <Field className="field"
          type="email" 
          name="email" 
          placeholder="Your Email"/>
          {touched.email && errors.email && <p> {errors.email}</p>}
      </div>

      <div>
      <Field className="field"
        type="password"
        name="password"
        placeholder="Your Password"/>
        {touched.password && errors.password && <p> {errors.password}</p>}
      </div>

      <button type="submit">Submit</button>
    </Form>

    <label>Already have an account?</label>
    <button type="submit" onClick={redirectToLogin}>Log in!</button>
  </div>
  
)


const Register = withFormik ({
    mapPropsToValues({name, email, password}) {
        return {
            email: email || '',
            password: password ||'',
            name: name || ''
        }
    },

    validationSchema: Yup.object().shape({
    name: Yup.string() 
              .min(3, 'Name must be 3 characters or longer')
              .max(60, 'Name must be shorter than 60 characters')
              .required('Name is required'),
    email: Yup.string()
              .email('Email not valid')
              .max(100)
              .required('Email is required')
              .test("checkEmail", "Email was already used", 
                async function(email) {
                  const res = await fetch('http://localhost:5000/api/UserExists', {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 'email': email })
                  });
                  const res_1 = await res.json();
                  return !res_1.exists;
                }),
    password: Yup.string()
                 .min(8, 'Password must be 8 characters or longer')
                 .max(100, 'Password must be shorter than 100 characters')
                 .matches(passwordRegex, 'Password must have a number, capital letter and a special character.')
                 .required('Password is required')
    }),
    
    handleSubmit(values) {
        fetch('http://localhost:5000/api/Register', {
          method: "POST", 
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({'name' : values.name,
                                'email' : values.email,
                                'password' : values.password})
        })
        .then((res) => res.json())
        .then(json => {
          console.log(json)
          sessionStorage.setItem("authToken", json.authToken);
          ReactDOM.render(
            <App />,
            document.getElementById('root')
          );
        })
    }
}) (RegisterApp)

export default Register