# RedPandas

## About

For the last few years, we've noticed that data science is rapidly becoming a necessity in collegiate research even in non-technical fields - whether it's a bio lab or a sociology research group, students across the board are increasingly being expected to be to use and manipulate data without formal technical training. We noticed that even when the data-science tools themselves are understood, more technical operational requirements - such as cloud hosting and model deployment, are a major bottlenecks in the efficacy of research groups, as they often struggle to move projects past the local filesystem.

Red Pandas is a platform that makes data accessible to all. Users can import data, manipulate/visualize it, and share their results all from an easy-to-use web-based platform. We also integrated a GPT-based code generator in our text editor so that even those with no programming experience can use the platform as well.

## Use Cases
- Hosts data science workflows without users ever having to interact with a cloud provider!
- Enables those with experience to write python and manipulate data from an easy-to-use code editor
- Novices can build code using GPT-3 without formal programming experience
- Can share entire projects (data + scripts), unlike any other platform.
- Iterative programming experiences that minimizes the monotony of Jupyter notebooks. 

## How we Built It
- CLI in Go for uploading even the largest datasets
- Frontend in Next.js React
-  Interpreter in a Rust docker image that executes the Python provided by a user

## Challenges We Ran Into
- Rust's (lack of) interoperability and the many many challenges that came with that
- Poor documentation for many of the libraries we used
- Maintaining good security-standards throughout the development process
- Assigning and delegating tasks efficiently so that our final product would be finished in time
- Docker build times
- General doziness

## Accomplishments That We're Proud Of
- Teaching 2 team members Go entirely during the hackathon
- Architecting and decomposing a multi-faceted solution under a significant time constraint.
- Our journey as teammates and friends over the course of HoyaHacks

## What We Learned
- Go
- How to Deploy Docker images to GCP

## What's Next for Red Pandas
- Better User-Interface
- Real-Time Collaboration
- Report Creation
- Performance improvements
