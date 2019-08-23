import React from "react";
import { Link } from "react-router-dom";
import { Form as FormikForm, Field, withFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

class Login extends React.Component  {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  componentDidUpdate(prevProps, prevState) {
    if (this.props.status !== prevProps.status && this.props.status) {
      this.props.history.push('/bubbles');
    }
  }
  render() {
  return (
    <div style={{display: 'felx', flexDirection: 'column', alignItems: 'center', margin: '0 auto'}}>
      <h1>Welcome to the Bubble App!</h1>
      <div className="form">
        <h1 style={{marginBottom: '0', color: 'rgb(89, 95, 99)'}}>Login</h1>
        <FormikForm style={{display: 'flex', flexDirection: 'column', margin: '20px'}}>
          <Field type="text" name="username" placeholder="Username" />
          {this.props.touched.username && this.props.errors.username && (
            <p className="error">{this.props.errors.username}</p>
          )}
          <Field type="password" name="password" placeholder="Password" />
          {this.props.touched.password && this.props.errors.password && (
            <p className="error">{this.props.errors.password}</p>
          )}
          <button type="submit">Login</button>
        </FormikForm>
      </div>
    </div>
  );
}
};

const FormikLoginForm = withFormik({
  mapPropsToValues({ username, password }) {
    return {
      username: username || '',
      password: password || '',
    };
  },

  validationSchema: Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required()
  }),

  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post('http://localhost:5000/api/login', values)
      .then(res => {
        resetForm();
        localStorage.setItem('token', res.data.payload);
        setStatus(res.data);
      })
      .catch(err => console.log(err.response));
  }
})(Login);

export default FormikLoginForm;
