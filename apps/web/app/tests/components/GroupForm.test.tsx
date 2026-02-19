import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GroupForm from "../../components/GroupForm";
import { describe, expect, test, vi } from "vitest";

describe("GroupForm", () => {
  test("renders form with all fields", () => {
    render(<GroupForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  test("renders edit form with initial data", () => {
    const initialData = { group_name: "Study Group" };
    render(
      <GroupForm
        initialData={initialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/Group Name/i)).toHaveValue("Study Group");
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  test("calls onSubmit with correct data on create", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<GroupForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/Group Name/i), "Study Group");
    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({ group_name: "Study Group" });
  });

  test("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<GroupForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(handleCancel).toHaveBeenCalled();
  });
});
