# Plane Boarding Simulation


## Summary

Visit the [Live Demo.](https://plane-boarding.vercel.app/)

Allows for simulation of the following plane boarding methods.

- Random
- Back To Front
- Front To Back
- Rotating Zone
- Wilma Straight
- Wilma Block
- Steffen Perfect
- Steffen Modified
- Reverse Pyramid

## Plane

The plane can be modified to change the number of rows and columns to customize the amount of passengers.
The size alters the size of all passengers and seats, allowing more/less to fit on screen.

## Passengers

The base speed of walking and stowing can be altered.
Get differing speeds by toggling the random speed/stow.

## Order of Seat Assignment
Below is the order in which seats are generated and assigned to a group.

The order of the first 10 seats ( s ) are labelled.

The center walking path is labelled with ( - ).

This order continues until all seats are created.

|       |       |       |       |       |
| :---: | :---: | :---: | :---: | :---: |
|  s₁   |  s₂   |  s₃   |  s₄   |  s₅   |
|  s₆   |  s₇   |  s₈   |  s₉   |  s₁₀  |
|   -   |   -   |   -   |   -   |   -   |
|  s₁₁  |   s   |   s   |   s   |   s   |
|  s₁₆  |   s   |   s   |   s   |   s   |
