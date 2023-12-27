import { FormItem, FormLayout } from '@formily/antd-v5';
import { registerValidateRules } from '@formily/core';
import React from 'react';
import { defaultProps, operators } from './properties';
import { CollectionFieldInterfaceV2 } from '../../application';

registerValidateRules({
  json(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return {
        type: 'error',
        message: error.message,
      };
    }
  },
});

export const json = new CollectionFieldInterfaceV2({
  name: 'json',
  type: 'object',
  group: 'advanced',
  order: 4,
  title: '{{t("JSON")}}',
  sortable: true,
  default: {
    type: 'json',
    // name,
    uiSchema: {
      type: 'object',
      // title,
      'x-component': 'Input.JSON',
      'x-component-props': {
        autoSize: {
          minRows: 5,
          // maxRows: 20,
        },
      },
      default: null,
    },
  },
  availableTypes: ['json', 'array', 'jsonb'],
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    jsonb: {
      type: 'boolean',
      title: 'JSONB',
      // 不直接用 `FormItem` 的原因是为了想要设置 `FormLayout` 的 `layout` 属性为 `horizontal` （默认就是 horizontal）
      'x-decorator': ({ children }) => (
        <FormLayout>
          <FormItem>{children}</FormItem>
        </FormLayout>
      ),
      'x-component': 'Checkbox',
      'x-hidden': `{{ !isDialect('postgres') }}`,
      'x-disabled': `{{ disabledJSONB }}`,
    },
  },
  filterable: {
    operators: operators.string,
  },
});