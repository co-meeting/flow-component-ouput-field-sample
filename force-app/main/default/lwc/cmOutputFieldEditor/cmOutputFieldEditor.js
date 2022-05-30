import { LightningElement, track, api } from 'lwc';

export default class CmOutputFieldEditor extends LightningElement {
  // 画面フローコンポーネントの公開プロパティの値
  _inputVariables = [];
  // 画面フローコンポーネントの公開プロパティのデータ構造
  _genericTypeMappings;
  // フローの要素およびリソースに関すデータ(入力変数の名前と型など)
  @api builderContext = {};
  // 自動保存された変数のデータ構造が含まれた公開プロパティ【追加】
  @api automaticOutputVariables;

  @track
  inputValues = {
    objectName: {
      value: null,
      valueDataType: 'string',
      isCollection: false, // 追加
      label: 'S オブジェクト種別' // 画面フロー標準のエラーと名前を合わせるために変更
    },
    record: {
      value: null,
      valueDataType: 'reference',
      isCollection: false, // 追加
      label: 'レコード'
    },
    fieldName: {
      value: null,
      valueDataType: 'string',
      isCollection: false, // 追加
      label: '項目名'
    }
  };

  // 画面フローコンポーネントの公開プロパティの値を取得・設定
  @api
  get inputVariables() {
    return this._inputVariables;
  }
  set inputVariables(variables) {
    this._inputVariables = variables || [];
    this._initializeValues();
  }

  // 画面フローコンポーネントの公開プロパティのデータ構造を取得・設定
  @api get genericTypeMappings() {
    return this._genericTypeMappings;
  }
  set genericTypeMappings(mappings) {
    this._genericTypeMappings = mappings;
    this._initializeObjectName();
  }

  // 公開プロパティの値(_inputVariables)を解析して内部変数inputValuesを初期化
  _initializeValues() {
    this._inputVariables.forEach((variable) => {
      this.inputValues[variable.name] = {
        ...this.inputValues[variable.name],
        value: variable.value,
        valueDataType: variable.valueDataType,
        isCollection: variable.isCollection
      };
    });
  }

  // 公開プロパティのデータ構造(genericTypeMappings)を解析して内部変数inputValuesのオブジェクト値をセット
  _initializeObjectName() {
    const type = this.genericTypeMappings.find(
      ({ typeName }) => typeName === 'T'
    );
    this.inputValues.objectName.value = type && type.typeValue;
  }

  // 公開プロパティ「レコード」が変更された時
  // 関連するプロパティ（オブジェクト｜項目名）の値変更も含めて、画面フロー側に値とpropertyTypeの変更を通知する
  handleChangeRecord(event) {
    if (event.target && event.detail) {
      const lookupReferenceName = event.detail.newValue;
      // レコードのobjectNameを取得
      const lookupRecordObjectName = this._getRecordLookupsObjectName(lookupReferenceName);
      if (lookupRecordObjectName != null) {
        // propertyType name="T"に対する設定
        this._dispatchFlowTypeMappingChangeEvent('T', lookupRecordObjectName);
        // property name="objectName"に対する設定
        this._dispatchFlowValueChangeEvent('objectName', lookupRecordObjectName, 'string');
        // property name="record"に対する設定
        this._dispatchFlowValueChangeEvent('record', lookupReferenceName, 'reference');
      } else {
        this._dispatchFlowValueChangeEvent('objectName', '', 'string');
        this._dispatchFlowValueChangeEvent('record', '', 'reference');
        this._dispatchFlowValueChangeEvent('fieldName', '', 'string');
        this.inputValues.objectName.value = '';
        this.inputValues.fieldName.value = '';
      }
    }
  }

  // 入力されたレコードの変数名をもとにbuilderContextを検索してpropertyType情報を取得
  _getRecordLookupsObjectName(lookupRecordName) {
    if (!this.builderContext.recordLookups) {
      return null;
    }
    const lookupRecord = this.builderContext.recordLookups.find(
      ({ name }) => name === lookupRecordName
    );
    if (lookupRecord) {
      return lookupRecord.object;
    }
    return null;
  }

  // 公開プロパティ「項目名」が変更された時、画面フロー側に状態の変更を通知する
  handleChangeFieldName(event) {
    if (event.detail) {
      this.inputValues.fieldName.value = event.detail.value;
      this._dispatchFlowValueChangeEvent('fieldName', event.detail.value, 'string');
    } else {
      this.inputValues.fieldName.value = '';
      this._dispatchFlowValueChangeEvent('fieldName', '', 'string');
    }
  }

  // 公開プロパティの値が変更されたことを通知する
  _dispatchFlowValueChangeEvent(id, newValue, newValueDataType) {
    const valueChangedEvent = new CustomEvent(
      'configuration_editor_input_value_changed',
      {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          name: id,
          newValue: newValue ? newValue : null,
          newValueDataType: newValueDataType
        }
      }
    );
    this.dispatchEvent(valueChangedEvent);
  }

  // 公開プロパティのpropertyTypeが変更されたことを通知する
  _dispatchFlowTypeMappingChangeEvent(typeName, typeValue) {
    const typeChangedEvent = new CustomEvent(
      'configuration_editor_generic_type_mapping_changed',
      {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          typeName,
          typeValue
        }
      }
    );
    this.dispatchEvent(typeChangedEvent);
  }
}
