import React from "react"
import PropTypes from "prop-types"
//import TextArea from "react-expanding-textarea"
import brace from "brace"
import AceEditor from "react-ace"
import "brace/mode/coffee"
import "brace/theme/github"

class CodeInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      text: "",
      timeout: null,
    }
  }

  handleChange(text) {
    this.setState({ text }, () => {
      clearTimeout(this.state.timeout)
      this.setState({
        timeout: setTimeout(() => {
          this.props.onChange(text)
        }, 1000),
      })
    })
  }

  render() {
    return (
      <AceEditor
        mode="coffee"
        theme="github"
        height={this.props.height}
        width={this.props.width}
        onChange={this.handleChange}
        value={this.state.text}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
      />
    )
  }
}

CodeInput.propTypes = {
  height: PropTypes.oneOf(PropTypes.number, PropTypes.string).isRequired,
  width: PropTypes.oneOf(PropTypes.number, PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CodeInput
