import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateListingForm from "../../components/Forms/Listings/UpdateListingForm";
import TwiceLovedApi from "../../api"; 
import AuthContext from "../../context/AuthContext";
import ListingsContext from "../../context/ListingsContext";
import ImpactContext from "../../context/ImpactContext";
import FilterOptionsContext from "../../context/FilterOptionsContext";
import { MemoryRouter } from "react-router-dom";

jest.mock('../../api', () => ({
    patchListing: jest.fn(),
}));

const mockAuthValue = { user: { username: 'testUser' } };
const mockListingsValue = {
    setListings: jest.fn(),
};
const mockImpactValue = { setItemsGivenAway: jest.fn() };
const mockFilterOptionsValue = {
    categories: ['Category 1', 'Category 2'], 
    conditions: ['New', 'Used'], 
};

describe('UpdateListingForm', () => {
    beforeEach(() => {
        TwiceLovedApi.patchListing.mockReset();
    });

    it('submits the form successfully', async () => {
        TwiceLovedApi.patchListing.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
            <AuthContext.Provider value={mockAuthValue}>
                <ListingsContext.Provider value={mockListingsValue}>
                    <ImpactContext.Provider value={mockImpactValue}>
                        <FilterOptionsContext.Provider value={mockFilterOptionsValue}>
                            <UpdateListingForm onNotAvail={jest.fn()} />
                        </FilterOptionsContext.Provider>
                    </ImpactContext.Provider>
                </ListingsContext.Provider>
            </AuthContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: '1' } }); 
        fireEvent.change(screen.getByLabelText('Condition'), { target: { value: '1' } }); 
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Available' } }); 

        fireEvent.click(screen.getByText('Update Listing'));

        await waitFor(() => {
            expect(TwiceLovedApi.patchListing).toHaveBeenCalledTimes(1);
        });
    });

    it('displays an error message on submission failure', async () => {
        TwiceLovedApi.patchListing.mockRejectedValueOnce(new Error('Failed to update listing'));

        render(
            <MemoryRouter>
            <AuthContext.Provider value={mockAuthValue}>
                <ListingsContext.Provider value={mockListingsValue}>
                    <ImpactContext.Provider value={mockImpactValue}>
                        <FilterOptionsContext.Provider value={mockFilterOptionsValue}> 
                            <UpdateListingForm onNotAvail={jest.fn()} />
                        </FilterOptionsContext.Provider>
                    </ImpactContext.Provider>
                </ListingsContext.Provider>
            </AuthContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: '1' } }); 
        fireEvent.change(screen.getByLabelText('Condition'), { target: { value: '1' } }); 
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Available' } }); 

        fireEvent.click(screen.getByText('Update Listing'));

        await waitFor(() => {
            expect(screen.getByText(/Failed to update listing/i)).toBeInTheDocument();
        });
    });
});
