import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TrainingForm } from "@/components/admin/training-form";

export default function NewTrainingPage() {
  return (
    <div>
      <AdminPageHeader
        title="New training"
        description="Add a training program."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Trainings", href: "/admin/trainings" },
          { label: "New" },
        ]}
      />
      <TrainingForm />
    </div>
  );
}
