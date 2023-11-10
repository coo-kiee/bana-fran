import { FormEventHandler, FormHTMLAttributes, PropsWithChildren } from 'react';

interface IForm extends PropsWithChildren, FormHTMLAttributes<HTMLFormElement> {
  onSubmit: () => void;
}
const Form = ({ onSubmit, children, ...formAttributes }: IForm) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} {...formAttributes}>
      {children}
    </form>
  );
};

export default Form;
