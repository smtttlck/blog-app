import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

// helper functions for the app 

// icon name converter based on route names
export const iconNameConverter = (routeName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (routeName) {
        case 'Home':
            return 'home-outline';
        case 'Discover':
            return 'compass-outline';
        case 'Profile':
            return 'account-circle-outline';
        default:
            return 'circle-outline'; // default icon
    }
};

// converts server image path to full URL for mobile app
export const imgPathConverter = (path: string) => {
  if (!path || typeof path !== 'string') {
    return ''; // or return a default image URL
  }
  return `${path.split('localhost:3001').join(process.env.API_BASE_URL)}`;
};


// converts profile image path to full URL for mobile app
export const profileImgPathConverter = (path: string) => {
  if (!path || typeof path !== 'string') {
    return ''; // or return a default profile image URL
  }
  return `http://${process.env.API_BASE_URL}${path.split('public')[1].split('\\').join('/')}`;
}

// converts blog date to a more readable format
export const blogDateConverter = (dateString: string) => {
    const start = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffDays === 0) {
        return "today";
    }

    if (diffYears >= 1) {
        return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffMonths >= 1) {
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
};

// converts sort option from human-readable to API parameter
export const sortOptionConverter = (sortOption: string) => {
    switch (sortOption) {
        case 'Latest Published':
            return 'createdAt';
        case 'Most Bookmarked':
            return 'bookmarkCounter';
    }
};