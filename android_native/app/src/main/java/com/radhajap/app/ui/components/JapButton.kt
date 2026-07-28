package com.radhajap.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.radhajap.app.ui.theme.GoldAmber
import com.radhajap.app.ui.theme.GoldLight

@Composable
fun JapButton(
    mantraText: String,
    onTap: () -> Unit
) {
    var lastTapTime by remember { mutableStateOf(0L) }
    var isPressed by remember { mutableStateOf(false) }

    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.92f else 1.0f,
        animationSpec = tween(durationMillis = 80),
        label = "buttonScale",
        finishedListener = { isPressed = false }
    )

    val interactionSource = remember { MutableInteractionSource() }

    Box(
        modifier = Modifier
            .size(240.dp)
            .scale(scale)
            .clip(CircleShape)
            .background(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFFFBBF24),
                        Color(0xFFD97706),
                        Color(0xFF78350F)
                    )
                )
            )
            .border(
                width = 4.dp,
                brush = Brush.linearGradient(
                    colors = listOf(GoldLight, GoldAmber)
                ),
                shape = CircleShape
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null
            ) {
                val now = System.currentTimeMillis()
                if (now - lastTapTime > 120) {
                    lastTapTime = now
                    isPressed = true
                    onTap()
                }
            },
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "जय श्री",
                fontSize = 16.sp,
                color = Color(0xFFFEF3C7),
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = mantraText,
                fontSize = 42.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "स्पर्श करें (Tap)",
                fontSize = 12.sp,
                color = Color(0xFFFDE68A)
            )
        }
    }
}
