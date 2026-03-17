import { fireEvent, render, waitFor } from '@testing-library/react-native';
import BlogCard from '../components/BlogCard';
import { basicMockBlog } from '../utils/testHelpers';

const mockHandlePress = jest.fn(); // Mock function to test bookmark press handling

// Mock the useBlogCardBookmark hook to control its behavior in tests
jest.mock("../../src/hooks/useBlogCardBookmark", () => ({
    useBlogCardBookmark: () => {
        const React = require('react');
        const [isBookmarkedState, setIsBookmarkedState] = React.useState(false);

        return {
            isBookmarkedState,
            handleBookmarkPress: () => {
                mockHandlePress();
                setIsBookmarkedState((prev: boolean) => !prev);
            },
        };
    },
}));

beforeEach(() => {
    mockHandlePress.mockClear(); // Clear mock function calls before each test to ensure test isolation
});

describe('BlogCard Component', () => {

    const mockBlog = basicMockBlog; // Use the basic mock blog data for testing

    test('renders blog infos', () => {

        const { getByText } = render(<BlogCard {...mockBlog} />);

        expect(getByText(mockBlog.title)).toBeTruthy(); // Check if title is rendered
        expect(() => getByText(mockBlog.text, { exact: false })).toThrow(); // Check if text is not rendered
        expect(getByText(`${mockBlog.commentCounter}`)).toBeTruthy(); // Check if comment count is rendered
        expect(getByText('today')).toBeTruthy(); // Check if createdAt is rendered as "today"
        expect(getByText(mockBlog.authorId.username)).toBeTruthy(); // Check if author's username is rendered
        expect(getByText('New')).toBeTruthy(); // Check if "New" badge is rendered for recent blogs
    });

    test('renders bookmark status correctly', async () => {

        const { getByTestId } = render(<BlogCard {...mockBlog} onPressBookmark={mockHandlePress} />);

        const button = getByTestId('bookmark-button');
        const icon = getByTestId('bookmark-icon');

        expect(icon).toHaveProp('name', 'bookmark'); // Should be "bookmark" when not bookmarked

        fireEvent.press(button); // Simulate pressing the bookmark button

        expect(mockHandlePress).toHaveBeenCalledTimes(1); // Check if the bookmark press handler was called

        await waitFor(() => { // Wait for the state update to reflect in the component
            expect(getByTestId('bookmark-icon')).toHaveProp('name', 'bookmark-alt'); // Should be "bookmark-alt" after pressing the button to toggle bookmark state
        });
    });

    test('clicks onPressCard when card is pressed', () => {

        const { getByTestId } = render(<BlogCard {...mockBlog} onPressCard={mockHandlePress} />);

        fireEvent.press(getByTestId('card')); // Simulate pressing the card by pressing the card element

        expect(mockHandlePress).toHaveBeenCalledWith(mockBlog._id); // Check if onPressCard was called with the correct blog ID
    });

    test('clicks onPressProfile when profile section is pressed', () => {

        const { getByText } = render(<BlogCard {...mockBlog} onPressProfile={mockHandlePress} />);

        fireEvent.press(getByText(mockBlog.authorId.username)); // Simulate pressing the profile section by pressing the author's username

        expect(mockHandlePress).toHaveBeenCalledWith(mockBlog.authorId._id); // Check if onPressProfile was called with the correct user ID
    });
});
