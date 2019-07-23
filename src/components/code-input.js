import React from "react"
import TextArea from "react-expanding-textarea"

class CodeInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      text: null,
    }
  }

  handleChange(event) {
    event.preventDefault()
    const text = event.target.value
    this.setState(({ text: prevText }) => {
      if (prevText !== text) {
        this.props.onChange(text)
        return { text }
      }
    })
  }

  render() {
    return (
      <TextArea
        maxLength="3000"
        className="textarea"
        name="code"
        placeholder="CoffeeScript"
        onChange={this.handleChange}
      />
    )
  }
}

export default CodeInput
