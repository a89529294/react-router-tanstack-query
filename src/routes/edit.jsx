import { useQuery } from "@tanstack/react-query";
import { Form, redirect, useNavigate, useParams } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

const contactDetailQuery = (id) => ({
  queryKey: ["contacts", "detail", id],
  queryFn: async () => getContact(id),
});

export const action = (queryClient) =>
  async function ({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);

    // not necessary, since stale time is 0, so when contact page gets navigated to
    // useQuery will refetch in the background.
    await queryClient.invalidateQueries({ queryKey: ["contacts"] });
    return redirect(`/contacts/${params.contactId}`);
  };

export default function EditContact() {
  // const { contact } = useLoaderData();
  const params = useParams();
  const { data: contact } = useQuery(contactDetailQuery(params.contactId));
  const navigate = useNavigate();
  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
