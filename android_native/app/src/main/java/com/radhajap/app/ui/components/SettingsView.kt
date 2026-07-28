package com.radhajap.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.radhajap.app.data.AppSettings
import com.radhajap.app.data.AppState
import com.radhajap.app.ui.theme.GoldAmber
import com.radhajap.app.ui.theme.GoldLight
import com.radhajap.app.ui.theme.SurfaceDark

@Composable
fun SettingsView(
    state: AppState,
    onUpdateSettings: (AppSettings) -> Unit,
    onResetCounter: () -> Unit
) {
    val settings = state.settings
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(scrollState)
    ) {
        Text(
            text = "सेटिंग्स (Settings)",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = GoldLight,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                SettingSwitchRow(
                    title = "ध्वनि प्रभाव (Sound Effects)",
                    checked = settings.soundEnabled,
                    onCheckedChange = { onUpdateSettings(settings.copy(soundEnabled = it)) }
                )

                Spacer(modifier = Modifier.height(16.dp))

                SettingSwitchRow(
                    title = "कंपन (Vibration Feedback)",
                    checked = settings.vibrationEnabled,
                    onCheckedChange = { onUpdateSettings(settings.copy(vibrationEnabled = it)) }
                )

                Spacer(modifier = Modifier.height(16.dp))

                SettingSwitchRow(
                    title = "वाक् जप (Voice Chant TTS)",
                    checked = settings.voiceEnabled,
                    onCheckedChange = { onUpdateSettings(settings.copy(voiceEnabled = it)) }
                )

                if (settings.voiceEnabled) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "वाणी गति (Speech Speed): ${"%.1f".format(settings.speechRate)}x",
                        fontSize = 14.sp,
                        color = Color.White
                    )
                    Slider(
                        value = settings.speechRate,
                        onValueChange = { onUpdateSettings(settings.copy(speechRate = it)) },
                        valueRange = 0.5f..2.0f,
                        colors = SliderDefaults.colors(thumbColor = GoldAmber, activeTrackColor = GoldAmber)
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "वाणी स्वर (Pitch): ${"%.1f".format(settings.speechPitch)}",
                        fontSize = 14.sp,
                        color = Color.White
                    )
                    Slider(
                        value = settings.speechPitch,
                        onValueChange = { onUpdateSettings(settings.copy(speechPitch = it)) },
                        valueRange = 0.5f..1.5f,
                        colors = SliderDefaults.colors(thumbColor = GoldAmber, activeTrackColor = GoldAmber)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "दैनिक लक्ष्य (Daily Goal)",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GoldLight
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(108, 500, 1008, 2100).forEach { goal ->
                        Button(
                            onClick = { onUpdateSettings(settings.copy(dailyGoal = goal)) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (settings.dailyGoal == goal) GoldAmber else Color(0xFF3F1F07)
                            ),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(text = "$goal", fontSize = 12.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onResetCounter,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF991B1B)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text(
                text = "आज का काउंटर रीसेट करें (Reset Today's Count)",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }
    }
}

@Composable
fun SettingSwitchRow(
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title, fontSize = 15.sp, color = Color.White)
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = GoldAmber
            )
        )
    }
}
