const AboutUs: React.FC = () => {
  return (
    <div className="about fs-5 mt-2">

      <div className="about-img">
        <img src="/public/about.jpg " alt="About Page" />
      </div>
      <div className="about-text">
        <h1 className="about-title text-center">About Us</h1>

        <p>Hello! Welcome to our blog site.</p>

        <p>We are a group of writers and content creators who have come together to share our passion for
          knowledge and provide inspiring, educational, and entertaining content on various topics. Our aim
          is to offer you the highest quality and most up-to-date information, enriching your knowledge and
          adding value to your daily life.
        </p>

        <div className="text-group d-flex my-2">
          <div className="group col-4 px-2">
            <h3 className="text-center">Our Mission</h3>
            <p>To make information accessible and connect our readers with inspiring content. By offering the most current
              and accurate information in every field, we aim to guide curious minds and provide different perspectives.
            </p>
          </div>
          <div className="group col-4 px-2 border-start border-end">
            <h3 className="text-center">Our Vision</h3>
            <p>To make our site a reliable and inspiring platform where people of all ages and backgrounds can easily access information.
              Keeping up with the rapidly changing dynamics of the digital world, we strive to be by our readers' side with constantly
              updated and evolving content.
            </p>
          </div>
          <div className="group col-4 px-2">
            <h3 className="text-center">Our Team</h3>
            <p>Our team consists of individuals who have specialized in various fields and have experience in writing. Each of us works
              to provide you with the most current information and the most creative content in our respective areas of interest.
            </p>
          </div>
        </div>

        <p>By becoming a member of our blog site, you can access the latest content and exclusive articles, participate in discussions, and
          become part of our community. We organize special events, webinars, and workshops for our members. Join us and embark on this journey
          full of knowledge together with us!
        </p>

        <h5>Thank you!</h5>

      </div>

    </div>
  )
}

export default AboutUs;