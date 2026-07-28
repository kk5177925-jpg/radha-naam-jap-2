package com.radhajap.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.radhajap.app.data.AppState
import com.radhajap.app.ui.theme.GoldAmber
import com.radhajap.app.ui.theme.GoldLight
import com.radhajap.app.ui.theme.SurfaceDark

@Composable
fun StatsView(state: AppState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "सांख्यिकी एवं प्रगति (Statistics)",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = GoldLight,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "आज का जाप",
                value = "${state.todayCount}",
                subtitle = "${state.todayCount / 108} माला",
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "कुल जाप (Lifetime)",
                value = "${state.lifetimeCount}",
                subtitle = "${state.lifetimeCount / 108} माला",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "निरंतर दिन (Streak)",
                value = "${state.streak} दिन",
                subtitle = "दैनिक नियम",
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "सर्वश्रेष्ठ दिन (Best)",
                value = "${state.bestDay.count}",
                subtitle = state.bestDay.date.ifEmpty { "आज" },
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "पिछला इतिहास (History)",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = GoldLight,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        val historyList = state.history.toList().sortedByDescending { it.first }

        if (historyList.isEmpty()) {
            BoxCard(text = "अभी तक कोई इतिहास दर्ज नहीं है।")
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(historyList) { (date, count) ->
                    HistoryRow(date = date, count = count)
                }
            }
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(text = title, fontSize = 12.sp, color = Color(0xFFFDE68A))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = GoldAmber)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = subtitle, fontSize = 11.sp, color = Color.Gray)
        }
    }
}

@Composable
fun HistoryRow(date: String, count: Int) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = date, fontSize = 14.sp, color = Color.White)
            Text(
                text = "$count जाप (${count / 108} माला)",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = GoldAmber
            )
        }
    }
}

@Composable
fun BoxCard(text: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Text(
            text = text,
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(16.dp)
        )
    }
}
