workflow "Test, build, publish" {
  on = "push"
  resolves = ["Build"]
}

action "Install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "install"
}

action "Test Less" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Install"]
  args = "run less:lint"
}

action "Test JS" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Test Less"]
  args = "run test"
}

action "Build" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Test JS"]
  args = "run build"
}
