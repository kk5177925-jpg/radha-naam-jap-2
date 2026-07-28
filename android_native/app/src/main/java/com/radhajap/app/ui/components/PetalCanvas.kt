package com.radhajap.app.ui.components

import androidx.compose.animation.core.InfiniteRepeatableSpec
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import kotlin.random.Random

private data class Petal(
    val xRatio: Float,
    val speed: Float,
    val radius: Float,
    val color: Color
)

@Composable
fun PetalCanvas() {
    val infiniteTransition = rememberInfiniteTransition(label = "petals")
    val progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = InfiniteRepeatableSpec(
            animation = tween(durationMillis = 6000, easing = LinearEasing)
        ),
        label = "petalProgress"
    )

    val petals = rememberPetals()

    Canvas(modifier = Modifier.fillMaxSize()) {
        val width = size.width
        val height = size.height

        petals.forEach { petal ->
            val y = ((progress * petal.speed) % 1f) * height
            val x = petal.xRatio * width + Math.sin(y.toDouble() / 50.0).toFloat() * 15f

            drawCircle(
                color = petal.color,
                radius = petal.radius,
                center = Offset(x, y)
            )
        }
    }
}

@Composable
private fun rememberPetals(): List<Petal> {
    val random = Random(42)
    val colors = listOf(
        Color(0xFFF472B6), // Pink
        Color(0xFFFB7185), // Rose
        Color(0xFFFBBF24)  // Gold
    )
    return List(30) {
        Petal(
            xRatio = random.nextFloat(),
            speed = 0.5f + random.nextFloat() * 0.8f,
            radius = (6 + random.nextInt(8)).toFloat(),
            color = colors[random.nextInt(colors.size)]
        )
    }
}
