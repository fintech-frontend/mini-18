import ContactsMap from "@/components/contacts/ContactsMap";
import ContactsInfo from "@/components/contacts/ContactsInfo";
import QuestionForm from "@/components/contacts/QuestionForm";

function Kontakt() {
  return (
    <div>
      <div className="w-full">
        <ContactsMap />
        <ContactsInfo />
        <QuestionForm />
      </div>
    </div>
  );
}

export default Kontakt;
