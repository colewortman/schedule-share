import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScheduleForm from "../../components/ScheduleForm";
import { describe, expect, test, vi } from "vitest";
import { User, Group } from "../../types";

const mockUsers: User[] = [
  { user_id: "u1", user_name: "Alice", email: "alice@example.com" },
  { user_id: "u2", user_name: "Bob", email: "bob@example.com" },
];

const mockGroups: Group[] = [
  { group_id: "g1", group_name: "Study Group" },
  { group_id: "g2", group_name: "Work Team" },
];

describe("ScheduleForm", () => {
  test("renders create form with user and group selects", () => {
    render(
      <ScheduleForm
        users={mockUsers}
        groups={mockGroups}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/User/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  test("renders edit form with initial data", () => {
    const initialData = { user_id: "u1", group_id: "g1" };
    render(
      <ScheduleForm
        initialData={initialData}
        users={mockUsers}
        groups={mockGroups}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/User/i)).toHaveValue("u1");
    expect(screen.getByLabelText(/Group/i)).toHaveValue("g1");
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  test("populates user and group select options", () => {
    render(
      <ScheduleForm
        users={mockUsers}
        groups={mockGroups}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("option", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bob" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Study Group" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Work Team" })).toBeInTheDocument();
  });

  test("calls onSubmit with correct data on create", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ScheduleForm
        users={mockUsers}
        groups={mockGroups}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText(/User/i), "u1");
    await user.selectOptions(screen.getByLabelText(/Group/i), "g2");
    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      user_id: "u1",
      group_id: "g2",
    });
  });

  test("submits null values when no selections are made", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ScheduleForm
        users={mockUsers}
        groups={mockGroups}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      user_id: null,
      group_id: null,
    });
  });

  test("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(
      <ScheduleForm
        users={mockUsers}
        groups={mockGroups}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(handleCancel).toHaveBeenCalled();
  });
});
