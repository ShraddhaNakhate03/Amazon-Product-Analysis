import matplotlib.pyplot as plt
import numpy as np

# Simulate weight tracking over 8 weeks (dummy data: weight decreases from 75 kg to 72 kg)
weeks = np.arange(1, 9)
weights = 75 - np.linspace(0, 3, 8)

plt.figure(figsize=(8, 5))
plt.plot(weeks, weights, marker='o', color='purple')
plt.title('Weight Loss Progress Over 8 Weeks')
plt.xlabel('Week')
plt.ylabel('Weight (kg)')
plt.grid(True)
plt.show()
