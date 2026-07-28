package com.radhajap.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.radhajap.app.ui.theme.GoldAmber
import com.radhajap.app.ui.theme.GoldLight
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun MalaView(
    todayCount: Int,
    onTap: () -> Unit
) {
    val malaBeadsCompleted = todayCount % 108
    val totalMalaCompleted = todayCount / 108

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "108 मनका माला जाप (Mala Beads)",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = GoldLight
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "कुल पूर्ण माला: $totalMalaCompleted | वर्तमान मनका: $malaBeadsCompleted / 108",
            fontSize = 14.sp,
            color = Color(0xFFFDE68A)
        )
        Spacer(modifier = Modifier.height(24.dp))

        Box(
            modifier = Modifier.size(280.dp),
            contentAlignment = Alignment.Center
        ) {
            // Draw 108 mala beads circle
            Canvas(modifier = Modifier.fillMaxSize()) {
                val center = Offset(size.width / 2, size.height / 2)
                val radius = size.width / 2 - 20.dp.toPx()
                val totalBeads = 108

                for (i in 0 until totalBeads) {
                    val angle = (2 * Math.PI / totalBeads) * i - Math.PI / 2
                    val x = center.x + radius * cos(angle).toFloat()
                    val y = center.y + radius * sin(angle).toFloat()

                    val isDone = i < malaBeadsCompleted
                    val beadRadius = if (i % 27 == 0) 6.dp.toPx() else 3.5f.dp.toPx()
                    val beadColor = if (isDone) GoldAmber else Color(0xFF78350F)

                    drawCircle(
                        color = beadColor,
                        radius = beadRadius,
                        center = Offset(x, y)
                    )
                }
            }

            // Center Tap Button inside Mala Ring
            JapButton(mantraText = "राधा", onTap = onTap)
        }
    }
}
