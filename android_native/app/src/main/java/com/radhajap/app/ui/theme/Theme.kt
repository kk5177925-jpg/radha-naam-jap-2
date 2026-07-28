package com.radhajap.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val GoldLight = Color(0xFFFDE68A)
val GoldAmber = Color(0xFFF59E0B)
val GoldDark = Color(0xFFB45309)
val DevotionalBg = Color(0xFF1A0B00)
val SurfaceDark = Color(0xFF2A1505)

private val DarkColorScheme = darkColorScheme(
    primary = GoldAmber,
    secondary = GoldLight,
    tertiary = GoldDark,
    background = DevotionalBg,
    surface = SurfaceDark,
    onPrimary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun RadhaJaapTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
