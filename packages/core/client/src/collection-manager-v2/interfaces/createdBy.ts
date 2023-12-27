import { ISchema } from '@formily/react';
import { cloneDeep } from 'lodash';
import { defaultProps, operators, recordPickerViewer } from './properties';
import { CollectionFieldInterfaceV2 } from '../../application';

export const createdBy = new CollectionFieldInterfaceV2({
  name: 'createdBy',
  type: 'object',
  group: 'systemInfo',
  order: 3,
  title: '{{t("Created by")}}',
  isAssociation: true,
  default: {
    type: 'belongsTo',
    target: 'users',
    foreignKey: 'createdById',
    // name,
    uiSchema: {
      type: 'object',
      title: '{{t("Created by")}}',
      'x-component': 'AssociationField',
      'x-component-props': {
        fieldNames: {
          value: 'id',
          label: 'nickname',
        },
      },
      'x-read-pretty': true,
    },
  },
  availableTypes: ['belongsTo'],
  properties: {
    ...defaultProps,
  },
  filterable: {
    children: [
      {
        name: 'id',
        title: '{{t("ID")}}',
        operators: operators.id,
        schema: {
          title: '{{t("ID")}}',
          type: 'number',
          'x-component': 'InputNumber',
        },
      },
      {
        name: 'nickname',
        title: '{{t("Nickname")}}',
        operators: operators.string,
        schema: {
          title: '{{t("Nickname")}}',
          type: 'string',
          'x-component': 'Input',
        },
      },
    ],
  },
  schemaInitialize(schema: ISchema, { block }) {
    schema['properties'] = {
      viewer: cloneDeep(recordPickerViewer),
    };
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'] = schema['x-component-props'] || {};
      schema['x-component-props']['ellipsis'] = true;
    }
  },
});