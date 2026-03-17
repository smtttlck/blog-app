import { fireEvent, render } from "@testing-library/react-native";
import ProfileCard from "../components/ProfileCard";
import { basicMockUserForProfileCard } from "../utils/testHelpers";

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ProfileCard Component', () => {

    const mockUser = basicMockUserForProfileCard; // Use the basic mock user data for testing

    test('renders profile infos', () => {

        const { getByTestId } = render(<ProfileCard {...mockUser} />);

        expect(getByTestId('username')).toHaveTextContent(mockUser.username); // Check if username is rendered correctly
        expect(getByTestId('blog-counter')).toHaveTextContent(`${mockUser.blogCounter}`); // Check if blog counter is rendered correctly  
        expect(getByTestId('follower-counter')).toHaveTextContent(`${mockUser.followerCounter}`); // Check if follower counter is rendered correctly
        expect(getByTestId('following-counter')).toHaveTextContent(`${mockUser.followingCounter}`); // Check if following counter is rendered correctly
    });

    test('clicks onPressFollowers and onPressFollowing when respective sections are pressed', () => {

        const mockOnPressFollowers = jest.fn();
        const mockOnPressFollowing = jest.fn();

        const { getByTestId } = render(
            <ProfileCard
                {...mockUser}
                onPressFollowers={mockOnPressFollowers}
                onPressFollowing={mockOnPressFollowing}
            />
        );

        const buttonFollowers = getByTestId('follower-counter');
        fireEvent.press(buttonFollowers); // Simulate pressing the followers counter
        expect(mockOnPressFollowers).toHaveBeenCalled(); // Check if the followers counter press handler was called

        const buttonFollowing = getByTestId('following-counter');
        fireEvent.press(buttonFollowing); // Simulate pressing the following counter
        expect(mockOnPressFollowing).toHaveBeenCalled(); // Check if the following counter press handler was called
    });

    test('clicks onPressSettings when settings button is pressed', () => {

        const mockOnPressSettings = jest.fn();

        const { queryByTestId } = render(
            <ProfileCard
                {...mockUser}
                followButtonVisibility={false}
                onPressSettings={mockOnPressSettings}
            />
        );

        expect(queryByTestId('follow-button')).toBeNull(); // Check if follow button is not rendered
        expect(queryByTestId('settings-button')).toBeTruthy(); // Check if settings button is rendered

        const settingsButton = queryByTestId('settings-button');
        fireEvent.press(settingsButton); // Simulate pressing the settings button

        expect(mockOnPressSettings).toHaveBeenCalled(); // Check if the settings button press handler was called
    });

    test('clicks onPressFollowButton when follow button is pressed', () => {

        const mockOnPressFollowButton = jest.fn();

        const { queryByTestId } = render(
            <ProfileCard
                {...mockUser}
                followButtonVisibility={true}
                onPressFollowButton={mockOnPressFollowButton}
            />
        );

        expect(queryByTestId('settings-button')).toBeNull(); // Check if settings button is not rendered
        expect(queryByTestId('follow-button')).toBeTruthy(); // Check if follow button is rendered

        const followButton = queryByTestId('follow-button');
        fireEvent.press(followButton); // Simulate pressing the follow button

        expect(mockOnPressFollowButton).toHaveBeenCalledWith(mockUser.userId); // Check if the follow button press handler was called with the correct userId
    });

    test('follow button is disabled when followButtonDisabled is true', () => {

        const mockOnPressFollowButton = jest.fn();

        const { getByTestId } = render(
            <ProfileCard
                {...mockUser}
                followButtonDisabled={true}
                onPressFollowButton={mockOnPressFollowButton}
            />
        );

        fireEvent.press(getByTestId('follow-button'));

        expect(mockOnPressFollowButton).not.toHaveBeenCalled();
    });
});