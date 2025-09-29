import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import type { NoteTag } from "../../types/note";

export interface NoteFormValuesProps {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onClose: () => void;
}

const initialValues: NoteFormValuesProps = {
  title: "",
  content: "",
  tag: "Todo",
};

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Too long"),
  tag: Yup.string().required("Please choose your tag"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: async ({ title, content, tag }: NoteFormValuesProps) => {
      const res = await createNote({ title, content, tag });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNoteHubKey"] });
      onClose();
    },
  });

  const handleCreateNote = ({ title, content, tag }: NoteFormValuesProps) => {
    mutationPost.mutate({ title, content, tag });
  };

  const handleSubmit = (
    values: NoteFormValuesProps,
    actions: FormikHelpers<NoteFormValuesProps>,
  ) => {
    handleCreateNote(values);

    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || !dirty || isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
