import React, { PropTypes, Component } from 'react';
import { Convert } from 'pvtsutils';
import { WSActions, ProviderActions } from '../../actions/state';
import { CertHelper, regExps } from '../../helpers';
import { Button, SelectField, SelectNative, SelectItem, TextField } from '../basic';
import enLang from '../../langs/en.json';
import * as BodyStyled from '../create_certificate/styled/body.styled';
import {
  TextareaContainer,
  BtnsContainer,
  TextFieldContainer,
  InputFileContainer,
  LabelStyled,
} from './styled/body.styled';

export default class Body extends Component {

  static propTypes = {
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    providers: [],
  };

  static contextTypes = {
    deviceType: PropTypes.string,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      valid: false,
    };

    this.fieldNodes = {};
  }

  onSelectChange = (data) => {
    const { dispatch } = this.context;
    if (typeof data === 'string') {
      dispatch(ProviderActions.select(data));
    } else {
      dispatch(ProviderActions.select(data.value));
    }
  };

  onClickImportHandler = () => {
    const { dispatch } = this.context;
    const { textarea } = this.fieldNodes;
    const value = textarea.getValue();
    const preparedCert = CertHelper.prepareCertToImport(value);
    if (preparedCert) {
      dispatch(WSActions.importItem(preparedCert));
    }
  };

  onFileChangeHandler = (e) => {
    const elem = e.target;
    const file = elem.files[0];
    this.fileReaderHandler(file);
    elem.value = '';
  };

  onTextareaChangeHandler = (value, valid) => {
    this.setState({
      valid,
    });
  };

  onDropHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    this.fileReaderHandler(file);
  };

  decodeBinaryString(str) {
    const { textarea } = this.fieldNodes;
    try {
      let value = '';
      if (regExps.hex.test(str)) {
        value = str;
      } else if (regExps.base64.test(str)) {
        value = str;
      } else {
        value = CertHelper.formatDer(Convert.ToHex(Convert.FromBinary(str)));
      }

      textarea.fieldNode.value = value;
      textarea.validate();
      this.setState({
        valid: textarea.isValid(),
      });
    } catch (e) {
      alert('Cannot decode file.');
    }
  }

  fileReaderHandler(file) {
    const reader = new FileReader();
    const supportedFileExtension = ['csr', 'cer', 'req'];

    if (!file) {
      return false;
    }

    const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
    if (supportedFileExtension.indexOf(fileExtension) === -1) {
      alert('Not supported file format!');
      return false;
    }

    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      if (reader.error) {
        alert(`Your browser couldn't read the specified file (error code ${reader.error.code}).`);
      } else {
        this.decodeBinaryString(reader.result);
      }
    };
    return false;
  }

  render() {
    const { providers } = this.props;
    const { valid } = this.state;
    const { deviceType } = this.context;
    const selectedProvider = providers.filter(obj => obj.selected);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;
    const providersFiltered = providers.filter(f => !f.readOnly);

    return (
      <BodyStyled.Body>
        <BodyStyled.Container>
          <TextFieldContainer>
            {
              deviceType === 'phone'
                ? <SelectNative
                  labelText={enLang['ImportCertificate.Field.Provider']}
                  placeholder={enLang['Select.Label.Provider']}
                  options={providersFiltered.map(item => ({
                    value: item.id,
                    name: item.name,
                  }))}
                  defaultValue={currentProvider ? currentProvider.id : ''}
                  onChange={this.onSelectChange}
                />
                : <SelectField
                  labelText={enLang['ImportCertificate.Field.Provider']}
                  placeholder={enLang['Select.Label.Provider']}
                  defaultSelected={{
                    name: currentProvider ? currentProvider.name : '',
                    value: currentProvider ? currentProvider.id : '',
                    index: currentProvider ? currentProvider.index : 0,
                  }}
                  onChange={this.onSelectChange}
                >
                  {
                    providersFiltered.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.id}
                        primaryText={item.name}
                      />
                    ))
                  }
                </SelectField>
            }
          </TextFieldContainer>
          <TextareaContainer>
            <TextField
              labelText={enLang['ImportCertificate.Field.Certificate']}
              multiline
              ref={node => (this.fieldNodes.textarea = node)}
              validation={['hex', 'base64']}
              onChange={this.onTextareaChangeHandler}
              onDrop={this.onDropHandler}
            />
          </TextareaContainer>
          <BtnsContainer>
            <InputFileContainer>
              <LabelStyled htmlFor="file_input">
                { enLang['ImportCertificate.Btn.File'] }
              </LabelStyled>
              <input
                type="file"
                id="file_input"
                style={{
                  display: 'none',
                }}
                onChange={this.onFileChangeHandler}
              />
            </InputFileContainer>
            <Button
              primary
              onClick={this.onClickImportHandler}
              disabled={!valid}
            >
              { enLang['ImportCertificate.Btn.Import'] }
            </Button>
          </BtnsContainer>
        </BodyStyled.Container>
      </BodyStyled.Body>
    );
  }
}
