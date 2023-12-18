# BlockRequestProvider

其内部获取到 [BlockResourceProvider](xxx) 提供的 `resource`，根据 [BlockSettingsProvider](xx) 提供的参数，自动调用 `resource.get()` 或者 `resource.list()` 获取的区块的数据，并通过 context 传递下去。

## 请求参数

请求参数需要通过 DataBlockProvider 的[静态属性]()和[动态属性]()中的 `params` 传递，如果动态属性和静态属性都有，则最终会合并。

```ts | pure
const schema = {
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    'collection': 'users',
    'action': 'list',
    // 静态参数
    params: {
      pageSize: 10,
    }
  },
  // 动态参数
  'x-use-decorator-props': 'useDynamicDataBlockProps',
}

const useDynamicDataBlockProps: UseDataBlockProps<'CollectionList'>  = () => {
  return {
    params: {
      size: 15,
    }
  }
}
```

会自动调用 `resource.list()` 获取数据，发起 `GET /api/users:list?pageSize=10&size=15` 的请求。

## Hooks

### useBlockRequestV2()

用于获取请求对象，一般用区块组件中。

```tsx | pure
const MyTable = () => {
  const { data, loading } = useBlockRequestV2();

  return (
    <Table
      dataSource={data?.data || []}
      loading={loading}
      pagination={{
        total: data?.meta.total,
        pageSize: data?.meta.pageSize,
        page: data?.meta.page,
      }}
    />
  )
}
```

### useBlockRequestDataV2()

简化获取 `data`，相当于 `useBlockRequestV2().data`。

```tsx | pure
const request = useBlockRequestV2();
const data = useBlockRequestDataV2();

console.log(request.data === data);
```

## Record

### Get 请求

对于 `get` 请求，当获取到 `data` 数据后，会通过 `RecordProvider` 提供 `record` 对象，用于获取当前区块的数据。

```ts | pure
const schema = {
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    'collection': 'users',
    'action': 'get', // get 请求
  },
  // 动态参数
  'x-use-decorator-props': 'useDynamicFormProps',
}

const useDynamicDataBlockProps: UseDataBlockProps<'CollectionGet'>  = () => {
  return {
    params: {
      filterByTk: 1,
    }
  }
}
```

会自动调用 `resource.get()` 获取数据，发起 `GET /api/users:get/1` 的请求，并通过 `RecordProvider` 提供上下文。

```tsx | pure
const requestData = useBlockRequestDataV2();
const record = useRecordV2(); // record 上下文数据

// 相等
record.data === requestData;
```

### List 请求

对于 `list` 请求则不会提供 `record` 对象，需要自己通过 `<RecordProvider />` 设置上下文。

```tsx | pure
const MyTable = () => {
  const data = useBlockRequestDataV2();

  return (
    <Table
      dataSource={data?.data || []}
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: 'Action',
          render: (v, record) => {
            return (
              <RecordProvider record={record}>
                <MyAction />
              </RecordProvider>
            )
          },
        },
      ]}
      pagination={{
        total: data?.meta.total,
        pageSize: data?.meta.pageSize,
        page: data?.meta.page,
      }}
    />
  )
}

const MyAction = () => {
  const record = useRecordV2();
  return (
    <Button onClick={() => {
      console.log(record.data);
    }}>Dialog</Button>
  )
}
```