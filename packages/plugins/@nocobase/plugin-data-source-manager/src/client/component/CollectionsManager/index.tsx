/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { ISchema } from '@formily/react';
import { uid } from '@formily/shared';
import React from 'react';
import {
  SchemaComponent,
  AddCollection,
  AddCollectionAction,
  AddCollectionField,
  AddFieldAction,
  EditCollection,
  EditCollectionAction,
  EditCollectionField,
  EditFieldAction,
  OverridingCollectionField,
  OverridingFieldAction,
  SyncFieldsAction,
  SyncFieldsActionCom,
  ViewCollectionField,
  ViewFieldAction,
  SyncSQLFieldsAction,
  DeleteCollection,
  DeleteCollectionAction,
  CollectionCategroriesProvider,
  usePlugin,
} from '@nocobase/client';
import { useLocation } from 'react-router-dom';
import { ConfigurationTable } from './ConfigurationTable';
import { ConfigurationTabs } from './ConfigurationTabs';
import PluginDatabaseConnectionsClient from '../../';

const schema2: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-component': 'ConfigurationTable',
    },
  },
};

export const CollectionManagerPage = () => {
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const location = useLocation();
  const dataSourceType = new URLSearchParams(location.search).get('type');
  const type = dataSourceType && plugin.types.get(dataSourceType);
  return (
    <SchemaComponent
      schema={schema2}
      components={{
        CollectionCategroriesProvider,
        ConfigurationTable,
        ConfigurationTabs,
        AddFieldAction,
        AddCollectionField,
        AddCollection: type?.AddCollection || AddCollection,
        AddCollectionAction,
        EditCollection: type?.EditCollection || EditCollection,
        EditCollectionAction,
        DeleteCollection,
        DeleteCollectionAction,
        EditFieldAction,
        EditCollectionField,
        OverridingCollectionField,
        OverridingFieldAction,
        ViewCollectionField,
        ViewFieldAction,
        SyncFieldsAction,
        SyncFieldsActionCom,
        SyncSQLFieldsAction,
      }}
      scope={{
        allowCollectionDeletion: type?.allowCollectionDeletion,
        allowCongigureFields: type?.allowCongigureFields,
      }}
    />
  );
};
