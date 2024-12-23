interface Props{
  text: string;
  form: string;
  isLoading?: boolean;
}

const SubmitModalBtn = ({ text, form, isLoading = false }: Props) => {
  return (
    <button
      type="submit"
      className="btn-primary"
      form={form}
      disabled={isLoading}
    >
      {
        isLoading ? (
          "Loading..." 
        ) : text
      }
    </button>
  );
};

export default SubmitModalBtn;