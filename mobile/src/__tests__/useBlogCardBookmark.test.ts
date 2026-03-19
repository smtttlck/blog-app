import { act, renderHook } from "@testing-library/react-native";
import { useBlogCardBookmark } from "../hooks/useBlogCardBookmark";


describe('useBlogCardBookmark Hook', () => {

    const blogId = 'blog1'; // Sample blog ID for testing

    const mockHandlePress = jest.fn().mockResolvedValue(undefined); // Mock function to test bookmark press handling, resolves successfully by default

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test to ensure test isolation
    });

    test('initializes bookmark state correctly', () => {

        const { result } = renderHook(() =>
            useBlogCardBookmark(blogId, true, mockHandlePress)
        );

        expect(result.current.isBookmarkedState).toBe(true); // Should initialize with the provided bookmark state
    });

    test('updates bookmark state on press', async () => {

        const { result } = renderHook(() =>
            useBlogCardBookmark(blogId, false, mockHandlePress)
        );

        expect(result.current.isBookmarkedState).toBe(false); // Initial state should be false

        await act(async () => {
            await result.current.handleBookmarkPress(); // Simulate pressing the bookmark button
        });

        expect(mockHandlePress).toHaveBeenCalledWith(blogId, false); // Check if the bookmark press handler was called with correct arguments
        expect(result.current.isBookmarkedState).toBe(true); // State should toggle to true after pressing the button
    });

    test('handles errors in bookmark press handler', async () => {

        const error = new Error('Bookmark toggle failed');

        mockHandlePress.mockRejectedValueOnce(error); // Mock the bookmark press handler to reject with an error

        const { result } = renderHook(() =>
            useBlogCardBookmark(blogId, false, mockHandlePress)
        );
        expect(result.current.isBookmarkedState).toBe(false); // Initial state should be false

        await act(async () => {
            await result.current.handleBookmarkPress(); // Simulate pressing the bookmark button
        });

        expect(mockHandlePress).toHaveBeenCalledWith(blogId, false); // Check if the bookmark press handler was called with correct arguments
        expect(result.current.isBookmarkedState).toBe(false); // State should remain unchanged due to error
    });

    test('still toggles when onPressBookmark is not provided', async () => {

        const { result } = renderHook(() =>
            useBlogCardBookmark(blogId, false) // No onPressBookmark provided
        );

        expect(result.current.isBookmarkedState).toBe(false); // Initial state should be false

        await act(async () => {
            await result.current.handleBookmarkPress(); // Simulate pressing the bookmark button
        });

        expect(result.current.isBookmarkedState).toBe(true); // State should toggle to true even without onPressBookmark
    });
});