import React from "react";
import {clsx} from "clsx";

type StyledProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
};

export const styled = (defaultClass: string, component: React.ElementType = 'div') => {
  return ({ as: Component = component, className, ...rest }: StyledProps) => (
    <Component className={clsx(defaultClass, className)} {...rest} />
  );
};
