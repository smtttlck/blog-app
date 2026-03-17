import { render } from '@testing-library/react-native';
import App from '../../App';

test('App renders correctly', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Sign Up')).toBeTruthy(); // Check if "Sign Up" text is rendered, indicating the AuthStack is displayed
});