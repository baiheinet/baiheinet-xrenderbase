import React from 'react';
import { useCompile } from '../../../schema-component';
import { Icon } from '../../../icon';
import { Menu } from 'antd';
import { useSchemaInitializerMenuItems } from '../hooks';
import { uid } from '@formily/shared';
import { useStyles } from './style';
import classNames from 'classnames';

export interface SchemaInitializerItemProps {
  style?: React.CSSProperties;
  className?: string;
  name?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  items?: any[];
  onClick?: (args?: any) => any;
  applyMenuStyle?: boolean;
}

export const SchemaInitializerItem = React.forwardRef<any, SchemaInitializerItemProps>((props, ref) => {
  const { style, name = uid(), applyMenuStyle = true, className, items, icon, title, onClick, children } = props;
  const compile = useCompile();
  const childrenItems = useSchemaInitializerMenuItems(items, name, onClick);
  const { componentCls } = useStyles();
  if (items && items.length > 0) {
    return (
      <Menu
        ref={ref}
        items={[
          {
            key: name,
            style: style,
            className: className,
            label: children || compile(title),
            title: compile(title),
            onClick: (info) => {
              if (info.key !== name) return;
              onClick?.({ ...info, item: props });
            },
            icon: typeof icon === 'string' ? <Icon type={icon as string} /> : icon,
            children: childrenItems,
          },
        ]}
      ></Menu>
    );
  }

  return (
    <div ref={ref} onClick={(event) => onClick?.({ event, item: props })}>
      <div className={classNames({ [`${componentCls}-menu-item`]: applyMenuStyle }, className)} style={style}>
        {children || (
          <>
            {icon && <span>{typeof icon === 'string' ? <Icon type={icon as string} /> : icon}</span>}
            <span
              className={classNames({
                [`${componentCls}-menu-item-content`]: icon && applyMenuStyle,
              })}
            >
              {compile(title)}
            </span>
          </>
        )}
      </div>
    </div>
  );
});
