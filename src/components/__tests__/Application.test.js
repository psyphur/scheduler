import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected.", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  })

  
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment,"Saving")).toBeInTheDocument();
        
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")  
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, /delete the appointment?/i)).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining" (because the previous test decreases it by 1).
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")  
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Chohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click on edit button
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")  
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
    
    // 4. Check to see if edit mode is displayed with name Archie Cohen
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    
    // 5. Change name to something else
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click save
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check to see if saving status shows
    expect(getByText(appointment, "Saving"));

    // 8. Check to see if appointment is updated with new values
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones"));
  });


  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Chohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click on edit button
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")  
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
    
    // 4. Check to see if edit mode is displayed with name Archie Cohen
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. Click save
    fireEvent.click(getByText(appointment, "Save"))
    await waitForElement(() => getByText(appointment, "Error saving"))

    // 7. Check to see if error message shows
    expect(getByText(appointment, "Error saving")).toBeInTheDocument();
  });


  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Chohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click on delete button
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")  
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Check to see if delete mode is displayed
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click delete
    fireEvent.click(getByText(appointment, "Confirm"))
    await waitForElement(() => getByText(appointment, "Error deleting"))

    // 7. Check to see if error message shows
    expect(getByText(appointment, "Error deleting")).toBeInTheDocument();
  });
})
