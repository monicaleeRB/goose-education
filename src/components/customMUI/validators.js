import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import { Input, RadioGroup, Select, Typography } from '@material-ui/core';
import { KeyboardDatePicker,KeyboardDateTimePicker } from '@material-ui/pickers';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const errorStyles = {
  border: '1px solid #f44336',
  borderRadius: '4px'
}

const errorContainer = {
  color: '#f44336'
}

const errorText = {
  fontSize: '0.75rem',
  margin: '0 14px',
  textAlign: 'left'
}

class SelectValidator extends ValidatorComponent {  
  renderValidatorComponent() {
    const { children, errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Select {...rest}>{children}</Select>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography>{this.getErrorMessage()}</Typography>
  }
}

class QuillValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <ReactQuill {...rest}/>
        {this.errorText()}
      </>
  )}
  
  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography>{this.getErrorMessage()}</Typography>
  }
}

class FileValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Input type="file" {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography>{this.getErrorMessage()}</Typography>
  }
}

class RadioGroupValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <RadioGroup
        {...!this.state.isValid && { style: errorStyles }}
        {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return (
      <div style={errorContainer}>
        <Typography style={errorText}>{this.getErrorMessage()}</Typography>
      </div>
    )
  }
}

class DatePickerValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <KeyboardDatePicker {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography>{this.getErrorMessage()}</Typography>
  }
}

class DateTimePickerValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <KeyboardDateTimePicker {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography>{this.getErrorMessage()}</Typography>
  }
}

export { SelectValidator, QuillValidator, FileValidator, RadioGroupValidator, DatePickerValidator, DateTimePickerValidator }