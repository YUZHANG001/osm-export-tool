import React, {Component} from 'react';
import { Nav, NavItem, ButtonGroup, Row, Col, Panel, Button } from 'react-bootstrap';
import { Field, SubmissionError, formValueSelector, propTypes, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import ExportAOI from './aoi/ExportAOI';
import { createExport, getOverpassTimestamp } from '../actions/exportsActions';
import styles from '../styles/ExportForm.css';
import { AVAILABLE_EXPORT_FORMATS, getFormatCheckboxes, renderCheckboxes, renderCheckbox, renderInput, renderTextArea } from './utils';

const form = reduxForm({
  form: "ExportForm",
  onSubmit: (values, dispatch, props) => {
    console.log("Submitting form. Values:", values)

    let geom = props.aoiInfo.geojson;
    if (props.aoiInfo.geomType == null) {
      throw new SubmissionError({
        _error: 'Please select an area of interest →'
      });
    }

    if (props.aoiInfo.geojson.geometry) {
      geom = props.aoiInfo.geojson.geometry;
    }

    if (props.aoiInfo.geojson.features) {
      geom = props.aoiInfo.geojson.features[0].geometry;
    }

    const formData = {
      ...values,
      the_geom: geom
    };
    dispatch(createExport(formData,"ExportForm"))
  },

  validate: values => {
    console.log("Validating: ", values)
  }
})

const Describe = ({next}) => 
  <Row>
    <Field
      name='name'
      type="text"
      label='Name'
      placeholder="name this export"
      component={renderInput}
    />
    <Field
      name='description'
      type="text"
      label='Description'
      component={renderTextArea}
      rows='4'
    />
    <Field
      name='project'
      type="text"
      label='Project'
      placeholder="which activation this export is for"
      component={renderInput}
    />
    <Button bsSize="large" style={{float:"right"}} onClick={next}>Next</Button>
  </Row>

const SelectFeatures = ({next}) =>
  <Row>
    <ButtonGroup justified>
      <Button href="#">Tree Tag</Button>
      <Button href="#" active={true}>YAML</Button>
    </ButtonGroup>
    <Button style={{marginTop:'10px'}}>Load from JOSM Preset .XML</Button>
    <Field
      name='feature_selection'
      type="text"
      label='Feature Selection'
      component={renderTextArea}
      rows='10'
    />
    <Button bsSize="large" style={{float:"right"}} onClick={next}>Next</Button>
  </Row>

const ChooseFormats = ({next}) => 
  <Row>
    <Field
      name='export_formats'
      label='File Formats'
      component={renderCheckboxes}
    >
      {getFormatCheckboxes(AVAILABLE_EXPORT_FORMATS)}
    </Field>
    <Button bsSize="large" style={{float:"right"}} onClick={next}>Next</Button>
  </Row>

const Summary = ({ handleSubmit, formValues, error}) => 
  <Row>
    <Col xs={6}>
      Debugging form values:
      {JSON.stringify(formValues)}
    </Col>
    <Col xs={6}>
      <Field
        name='buffer_aoi'
        description='Buffer AOI'
        component={renderCheckbox}
        type='checkbox'
      />
      <Field
        name='published'
        description='Publish this export'
        component={renderCheckbox}
        type='checkbox'
      />

      <Button bsStyle="success" bsSize="large" type="submit" style={{width:"100%"}} onClick={handleSubmit}>Create Export</Button>
      {error && <p className={styles.error}><strong>{error}</strong></p>}
    </Col>
  </Row>

export class ExportForm extends Component {
  constructor(props) {
      super(props);
  }

  componentDidMount() {
    const { getOverpassTimestamp } = this.props
    getOverpassTimestamp()
  }

  state = {
    step: 1
  }

  handleStep1 = () => {
    this.setState({step:1})
  }

  handleStep2 = () => {
    this.setState({step:2})
  }

  handleStep3 = () => {
    this.setState({step:3})
  }

  handleStep4 = () => {
    this.setState({step:4})
  }

  render() {
    const { handleSubmit, formValues, error, overpassTimestamp } = this.props
    return( 
      <Row style={{height: '100%'}}>
        <Col xs={6} style={{height: '100%', overflowY: 'scroll', padding:"20px"}}>
          <Nav bsStyle="tabs" activeKey={this.state.step.toString()} style={{marginBottom:"20px"}}>
            <NavItem eventKey="1" onClick={this.handleStep1}>1 Describe Export</NavItem>
            <NavItem eventKey="2" onClick={this.handleStep2}>2 Select Features</NavItem>
            <NavItem eventKey="3" onClick={this.handleStep3}>3 Choose Formats</NavItem>
            <NavItem eventKey="4" onClick={this.handleStep4}>4 Summary</NavItem>
          </Nav>
          <form>
            { this.state.step == '1' ? <Describe next={this.handleStep2}/> : null }
            { this.state.step == '2' ? <SelectFeatures next={this.handleStep3}/> : null }
            { this.state.step == '3' ? <ChooseFormats next={this.handleStep4}/> : null }
            { this.state.step == '4' ? <Summary handleSubmit={handleSubmit} formValues={formValues} error={error}/>: null }
          </form>
          <Panel style={{marginTop:'20px'}}>
            OpenStreetMap database last updated: {overpassTimestamp} (x minutes ago)
          </Panel>
        </Col>
        <Col xs={6} style={{height: '100%', overflowY: 'scroll'}}>
          <ExportAOI/>
        </Col>
      </Row>
      )
  }
}

const mapStateToProps = state => {
  return {
    aoiInfo: state.aoiInfo,
    formValues:formValueSelector("ExportForm")(state,"name","description","project"),
    overpassTimestamp: state.overpassTimestamp,
    initialValues: {
      published: true,
      feature_selection: `
buildings:
    types:
        - lines
        - polygons
    select:
        - name
        - building
    where: building IS NOT NULL
      `.trim(),
      export_formats:["shp"]
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOverpassTimestamp: () => dispatch(getOverpassTimestamp())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(form(ExportForm));