interface Props{
  text: string;
  form: string;
}

const SubmitModalBtn = ({ text, form }: Props) => {
  return (
    <button
      type="submit"
      className="btn-primary"
      form={form}
    >
      {text}
    </button>
  );
};

export default SubmitModalBtn;