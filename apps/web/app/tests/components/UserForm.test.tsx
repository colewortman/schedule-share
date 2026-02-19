import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserForm from "../../components/UserForm";
import { describe, expect, test, vi } from "vitest";

describe("UserForm", () => {
  test("renders create form with all fields", () => {
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  test("renders edit form without password field", () => {
    const initialData = { user_name: "johndoe", email: "john@example.com" };
    render(<UserForm initialData={initialData} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/Username/i)).toHaveValue("johndoe");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("john@example.com");
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  test("calls onSubmit with correct data on create", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<UserForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/Username/i), "johndoe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/Password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      user_name: "johndoe",
      email: "john@example.com",
      password: "secret123",
    });
  });

  test("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<UserForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(handleCancel).toHaveBeenCalled();
  });
});
