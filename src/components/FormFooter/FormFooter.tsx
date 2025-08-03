type FormFooterProps = {
  canSubmit: boolean;
  onCancel: () => void;
};

export const FormFooter = ({ canSubmit, onCancel }: FormFooterProps) => (
  <div className="form-base__footer">
    <button className="primary-button" type="submit" disabled={canSubmit}>
      Submit
    </button>
    <button className="cancel-button" type="button" onClick={onCancel}>
      Cancel
    </button>
  </div>
);
