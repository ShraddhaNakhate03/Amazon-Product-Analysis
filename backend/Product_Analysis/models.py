from django.db import models

from django.db import models

class Product(models.Model):
    id = models.AutoField(primary_key=True) 
    title = models.CharField(max_length=255 )
    image = models.URLField()
    price = models.CharField(max_length=50)
    rating = models.CharField(max_length=20)
    num_reviews = models.CharField(max_length=50)
    availability = models.CharField(max_length=100)
    description = models.TextField()
    url = models.URLField(unique=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    content = models.TextField()
    rating = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Review for {self.product.title}"



class Feedback(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    message = models.TextField()

    def __str__(self):
        return self.name
