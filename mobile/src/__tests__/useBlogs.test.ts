import { act, renderHook } from "@testing-library/react-native";
import { useBlogs } from "../hooks/useBlogs";
import { mockBlogArray } from "../utils/testHelpers";
import * as blogService from "../services/blog.service";


jest.mock('../services/blog.service'); // Mock the blog service to isolate tests from actual API calls

describe('useBlogs Hook', () => {

    const token = 'token123'; // Sample token for testing
    const userId = 'user1'; // Sample user ID for testing
    const sort = 'latest'; // Sample sort parameter for testing
    const mockBlogs = mockBlogArray; // Use the mock blog array for testing

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test to ensure test isolation
    });

    test('fetches blogs on mount', async () => {

        (blogService.getBlogs as jest.Mock).mockResolvedValueOnce(mockBlogs); // Mock the getBlogs function to resolve with mock blogs

        const { result } = renderHook(() =>
            useBlogs(token, userId, sort)
        );

        await act(async () => {
            // Wait for the hook to update after fetching blogs
        });

        expect(blogService.getBlogs).toHaveBeenCalledWith(token, userId, sort); // Check if getBlogs was called with correct arguments
        expect(result.current.blogs).toEqual(mockBlogs); // The blogs state should be updated with the mock blogs
    });

    test('refetch updates blogs', async () => {

        const newMockBlogs = [...mockBlogs, { ...mockBlogs[0], _id: 'new-blog' }]; // Create a new mock blogs array with an additional blog

        (blogService.getBlogs as jest.Mock).mockResolvedValueOnce(mockBlogs).mockResolvedValueOnce(newMockBlogs); // Mock getBlogs to return different values on subsequent calls

        const { result } = renderHook(() =>
            useBlogs(token, userId, sort)
        );

        await act(async () => {
            // Wait for the initial fetch
        });

        expect(result.current.blogs).toEqual(mockBlogs); // Initial blogs should match the first mock

        await act(async () => {
            await result.current.refetch(); // Call the refetch function to fetch blogs again
        });

        expect(blogService.getBlogs).toHaveBeenCalledTimes(2); // getBlogs should have been called twice (initial fetch + refetch)
        expect(result.current.blogs).toEqual(newMockBlogs); // After refetch, blogs should match the new mock blogs
    });

    test('refetches when sort changes', async () => {

        const newSort = 'mostBookmarked'; // New sort parameter for testing
        const newMockBlogs = [...mockBlogs].reverse(); // Create a new mock blogs array in reverse order for the new sort

        (blogService.getBlogs as jest.Mock).mockResolvedValueOnce(mockBlogs).mockResolvedValueOnce(newMockBlogs); // Mock getBlogs to return different values on subsequent calls

        const { result, rerender } = renderHook(
            ({ sort }: { sort: "latest" | "mostBookmarked" }) => useBlogs(token, userId, sort),
            { initialProps: { sort } }
        );

        await act(async () => {
            // Wait for the initial fetch
        });

        expect(result.current.blogs).toEqual(mockBlogs); // Initial blogs should match the first mock

        await act(async () => {
            await rerender({ sort: newSort }); // Rerender the hook with the new sort value
        });

        expect(blogService.getBlogs).toHaveBeenCalledTimes(2); // getBlogs should have been called twice (initial fetch + sort change)
        expect(result.current.blogs).toEqual(newMockBlogs); // After sort change, blogs should match the new mock blogs
    });

    test('does not fetch if token is missing', async () => {

        renderHook(() =>
            useBlogs('', userId, sort) // Missing token
        );

        await act(async () => {
            // Wait for any potential updates
        });

        expect(blogService.getBlogs).not.toHaveBeenCalled(); // getBlogs should not be called if token is missing
    });

    test('does not fetch if userId is missing', async () => {

        renderHook(() =>
            useBlogs(token, '', sort) // Missing userId
        );

        await act(async () => {
            // Wait for any potential updates
        });

        expect(blogService.getBlogs).not.toHaveBeenCalled(); // getBlogs should not be called if userId is missing
    });
});